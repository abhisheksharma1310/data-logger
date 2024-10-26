import mongoose from "mongoose";
import { SerialPort } from "serialport";
import { ReadlineParser } from "serialport";
import Log from "../models/logModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../logData");
const configDir = path.join(__dirname, "../config");

// Ensure log and config directories exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
}

let port;
let parser;
let ioGlobal;

// Load configuration from file
const loadConfig = () => {
  const configPath = path.join(configDir, "serialLog.config.json");
  if (fs.existsSync(configPath)) {
    const configFile = fs.readFileSync(configPath);
    return JSON.parse(configFile);
  }
  return null;
};

// initialize serial port
const initSerialPort = async (config) => {
  const { comport, baudrate } = config;
  if (!port || !port.isOpen) {
    port = new SerialPort({ path: comport, baudRate: Number(baudrate) });
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    parser.on("data", (data) => {
      try {
        const jsonData = JSON.parse(data);
        if (!!ioGlobal) ioGlobal.emit("message", jsonData); // Emit JSON data through socket.io
      } catch (error) {
        console.error("Non-JSON data received:", error.message);
        if (!!ioGlobal) ioGlobal.emit("message", data); // Emit raw data through socket.io
      }
    });

    port.on("error", (err) => {
      console.error(`Error: ${err.message}`);
    });
  }
};

// api function for configure serialLog.config.json file
export const configureSerialPort = async (req, res, io) => {
  ioGlobal = io;
  const config = req.body;

  try {
    // Save configuration to file
    const configPath = path.join(configDir, "serialLog.config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Initialize serial port and parser
    await initSerialPort(config);

    port.on("open", () => {
      res.status(200).json({ message: "Port opened successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to open port: ${error.message}` });
  }
};

// function for log serial data
const startLogging = async () => {
  const config = loadConfig();
  if (!config) return;

  await initSerialPort(config);

  const { logToFile, logToDatabase, mongoConfig, fileFormat } = config;

  if (logToDatabase && mongoConfig) {
    mongoose.connect(mongoConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  parser.on("data", async (data) => {
    const logData = `${new Date().toISOString()} - ${data}\n`;
    const date = new Date().toISOString().split("T")[0];

    if (logToFile) {
      const fileName = path.join(
        logDir,
        `${date}.${fileFormat === "text" ? "txt" : "json"}`
      );
      fs.appendFile(fileName, logData, (err) => {
        if (err) console.error("Error logging data to file:", err);
      });
    }

    if (logToDatabase) {
      const logEntry = new Log({ data, timestamp: new Date() });
      try {
        await logEntry.save();
      } catch (err) {
        console.error("Error logging data to database:", err);
      }
    }
  });
};

// Initialize logging on application start if autoLog is enabled
const initializeLogging = async () => {
  const config = loadConfig();
  if (config && config.autoLog) {
    await startLogging();
  }
};

initializeLogging();

// api call function for retrive log file date wise
export const getLogsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const logs = await Log.find({
      timestamp: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lt: new Date(`${date}T23:59:59.999Z`),
      },
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
