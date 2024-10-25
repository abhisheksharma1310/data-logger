// controllers/serialController.js
import mongoose from "mongoose";
import { SerialPort } from "serialport";
import { ReadlineParser } from "serialport";
import Log from "../models/logModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../logData"); // Define logDir here
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

let port;
let parser;

export const configureSerialPort = async (req, res, io) => {
  const { comport, baudrate } = req.body;

  try {
    port = new SerialPort({ path: comport, baudRate: Number(baudrate) });

    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    parser.on("data", (data) => {
      try {
        const jsonData = JSON.parse(data);
        io.emit("message", jsonData); // Emit JSON data through socket.io
      } catch (error) {
        console.error("Non-JSON data received:", error.message);
        io.emit("message", data); // Emit raw data through socket.io
      }
    });

    port.on("open", () => {
      res.status(200).json({ message: "Port opened successfully" });
    });

    port.on("error", (err) => {
      res.status(500).json({ message: `Error: ${err.message}` });
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to open port: ${error.message}` });
  }
};

export const startDataLogging = async (req, res, io) => {
  const { logToFile, logToDatabase, mongoConfig, fileFormat } = req.body;

  if (!port || !port.isOpen) {
    try {
      await port.open();
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Failed to open port: ${error.message}` });
    }
  }

  if (logToDatabase && mongoConfig) {
    mongoose.connect(mongoConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  parser.on("data", async (data) => {
    const logData = `${new Date().toISOString()} - ${data}\n`;
    const date = new Date().toISOString().split("T")[0]; // Get the current date

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

  res.status(200).json({ message: "Data logging started" });
};

// controllers/serialController.js
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
