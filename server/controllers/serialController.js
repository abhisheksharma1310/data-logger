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

// listen for socket.io client
export const initSocketIo = (io) => {
  if (!!io) {
    ioGlobal = io;
    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("message", (msg) => {
        console.log("message: " + msg);
        io.emit("message", msg);
      });
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }
};

// emit function
const emitIo = (evenName, message) => {
  if (!!ioGlobal) ioGlobal.emit(evenName, message);
};

// Load configuration from file
const loadConfig = () => {
  const configPath = path.join(configDir, "serialLog.config.json");
  if (fs.existsSync(configPath)) {
    const configFile = fs.readFileSync(configPath);
    return JSON.parse(configFile);
  }
  return null;
};

// initialize databse using save config
const initMongoDB = (url) => {
  // Connect to MongoDB
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      emitIo("error", `Error connecting to MongoDB: , ${err}`);
    });
};

// initialize serial port based on given configuration
const initSerialPort = async (config) => {
  const { comport, baudrate } = config;
  if (!port || !port.isOpen) {
    port = new SerialPort({ path: comport, baudRate: Number(baudrate) });
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    parser.on("data", (data) => {
      try {
        const jsonData = JSON.parse(data);
        emitIo("serial-data-json", jsonData);
      } catch (error) {
        console.error("Non-JSON data received:", error.message);
        emitIo("serial-data-raw", data);
      }
    });

    port.on("open", () => {
      console.log("Serial port opened.");
      emitIo("serial-port", true);
    });
    port.on("close", () => {
      console.log("Serial port closed.");
      emitIo("serial-port", false);
    });

    port.on("error", (err) => {
      console.error(`Error: ${err.message}`);
      emitIo("error", err.message);
    });
  }
};

// function to start auto logging based on saved config file
const startLogging = async () => {
  const config = loadConfig();
  if (!config) return;

  await initSerialPort(config);

  const { autoLog, logToFile, logToDatabase, autoDelete } = config;

  if (autoLog) {
    parser.on("data", async (data) => {
      const logData = `${new Date().toISOString()} - ${data}\n`;
      const date = new Date().toISOString().split("T")[0];

      if (logToFile) {
        const fileName = path.join(logDir, `${date}.txt`);
        fs.appendFile(fileName, logData, (err) => {
          if (err) {
            console.error("Error logging data to file:", err);
            emitIo("error", `Error logging data to file:, ${err}`);
          }
        });
      }

      if (logToDatabase) {
        const logEntry = new Log({ data, timestamp: new Date() });
        try {
          await logEntry.save();
        } catch (err) {
          console.error("Error logging data to database:", err);
          emitIo("error", `Error logging data to database: ${err}`);
        }
      }
    });
  }

  // Schedule auto-delete if enabled
  if (autoDelete && autoDelete.enabled) {
    setInterval(() => {
      const deleteDate = new Date();
      deleteDate.setDate(deleteDate.getDate() - autoDelete.deleteAfterDays);

      // Delete old logs from database
      Log.deleteMany({
        timestamp: { $lt: deleteDate },
      }).exec();

      // Delete old log files
      try {
        fs.readdir(logDir, (err, files) => {
          if (err) throw err;
          files.forEach((file) => {
            const filePath = path.join(logDir, file);
            fs.stat(filePath, (err, stats) => {
              if (err) throw err;
              if (new Date(stats.mtime) < deleteDate) {
                fs.unlink(filePath, (err) => {
                  if (err) throw err;
                });
              }
            });
          });
        });
      } catch (error) {
        emitIo("error", `Error: delete old files `);
      }
    }, 24 * 60 * 60 * 1000); // Check every 24 hours
  }
};

// Initialize logging on application start if autoLog is enabled
const initializeLogging = async () => {
  const config = loadConfig();
  if (config && config.mongoConfig.url) {
    // call function to initialize mongo DB
    initMongoDB(config.mongoConfig.url);
  }
  if (config) {
    // call function to start logging
    await startLogging();
  }
};

// call function to initialize serial data logging
initializeLogging();

// api function for save configuration file received from client
export const configure = async (req, res) => {
  const { config } = req.body;

  try {
    // Save configuration to file
    const configPath = path.join(configDir, "serialLog.config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    res.status(200).json({
      message: `Deployed successfully at ${new Date()}`,
      config: config,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to deploy configuration: ${error.message}` });
    emitIo("error", `Failed to deploy configuration: ${error.message}`);
  }
};

// api function to initialize or check serial port status
export const checkSerialStatus = async (req, res) => {
  try {
    if (!port || !port.isOpen) {
      // Initialize serial port and parser
      const config = loadConfig();
      await initSerialPort(config);
    }

    if (port.isOpen) {
      res.status(200).json({ message: true });
    } else {
      res
        .status(500)
        .json({ message: `Failed to open port: ${error.message}` });
    }
  } catch (error) {
    res.status(500).json({ message: `Failed to open port: ${error.message}` });
    emitIo("error", `Failed to open port: ${error.message}`);
  }
};

// api function for send logs for requested date
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

// api function for delete requested logs by date
export const deleteLogsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    // Delete logs from database
    await Log.deleteMany({
      timestamp: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lt: new Date(`${date}T23:59:59.999Z`),
      },
    });

    // Delete log files
    const logFile = path.join(logDir, `${date}.txt`);
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }

    res.status(200).json({ message: "Logs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
