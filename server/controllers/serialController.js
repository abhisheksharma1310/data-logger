import mongoose from "mongoose";
import { SerialPort, ReadlineParser } from "serialport";
import Log from "../models/logModel.js";
import { updateIndexes, getLatestIndexes } from "../utils/indexLogs.js";
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

// get current date from todayLog file
const getCurrentLogDate = () => {
  const fileName = path.join(logDir, "todayLog.txt");
  if (!fs.existsSync(fileName)) {
    return null;
  }
  const data = fs.readFileSync(fileName, "utf-8").split("\n").filter(Boolean);
  const lastLog = data[data.length - 1];
  if (lastLog) {
    const logDate = new Date(lastLog.split(" - ")[0])
      .toISOString()
      .split("T")[0];
    return logDate;
  }
  return null;
};

// global variables
let port;
let parser;
let ioGlobal;
let deviceRemoved = false;
let currentDay = getCurrentLogDate() || new Date().toISOString().split("T")[0];

// listen for socket.io client
export const initSocketIo = (io) => {
  if (!!io) {
    ioGlobal = io;
    io.on("connection", (socket) => {
      console.log("a user connected");
      // listen message event and reply same msg
      socket.on("serial-data-write", (msg) => {
        // write data on serial port received from client
        if (port) port.write(msg);
      });
      // emit port status
      if (port) {
        emitIo("serial-port", port.isOpen);
      } else {
        emitIo("serial-port", false);
      }
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

// initialize databse using saved config
const initMongoDB = (url) => {
  // Connect to MongoDB
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      emitIo("error", `Error connecting to MongoDB: , ${err}`);
    });
};
// initialize serial port
const initSerialPort = async (config) => {
  const { comport, baudrate } = config;

  port = new SerialPort({ path: comport, baudRate: Number(baudrate) });
  parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  parser.on("data", (data) => {
    emitIo("serial-data", { timestamp: new Date(), data });
  });

  port.on("open", () => {
    console.log("Serial port opened.");
    emitIo("serial-port", true);

    if (deviceRemoved) {
      console.log("Device reinserted into the serial port.");
      deviceRemoved = false; // Reset flag
    }
  });

  port.on("close", () => {
    console.log("Serial port closed.");
    emitIo("serial-port", false);
    deviceRemoved = true; // Set flag for device removal
  });

  port.on("error", (err) => {
    console.error(`Error: ${err.message}`);
    emitIo("error", err.message);
  });
};

// log today serial port data
const logTodayData = (logData) => {
  const today = new Date().toISOString().split("T")[0];
  // Check if the date has changed
  if (today !== currentDay) {
    currentDay = today;
    // Clear the content of todayLog.txt at the start of the new day
    fs.writeFileSync(path.join(logDir, "todayLog.txt"), "");
  }
  const fileName = path.join(logDir, "todayLog.txt");
  fs.appendFile(fileName, logData, (err) => {
    if (err) {
      console.error("Error logging data to file:", err);
      // Emit your IO error event if required
      emitIo("error", `Error logging data to file: ${err}`);
    }
  });
};

// function to start auto logging based on saved config file
const startLogging = async () => {
  const config = loadConfig();
  if (!config) return;

  await initSerialPort(config);

  const { autoLog, logToFile, logToDatabase, autoDelete } = config;

  try {
    parser.on("data", async (data) => {
      const logData = `${new Date().toISOString()} - ${data}\n`;
      const date = new Date().toISOString().split("T")[0];

      // today logs
      logTodayData(logData);
      // logs to file
      if (autoLog && logToFile) {
        const fileName = path.join(logDir, `${date}.txt`);
        fs.appendFile(fileName, logData, (err) => {
          if (err) {
            console.error("Error logging data to file:", err);
            emitIo("error", `Error logging data to file:, ${err}`);
          }
        });
      }
      //logs to database
      if (autoLog && logToDatabase) {
        const logEntry = new Log({ data, timestamp: new Date() });
        try {
          await logEntry.save();
        } catch (err) {
          console.error("Error logging data to database:", err);
          emitIo("error", `Error logging data to database: ${err}`);
        }
      }
    });
  } catch (error) {
    emitIo("error", `Eror data logging: ${error}`);
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

// monitor serial port
const monitorSerialPort = (config) => {
  const { comport } = config;
  // Periodically check if the device is reinserted
  setInterval(async () => {
    try {
      const ports = await SerialPort.list();
      const portExists = ports.some((p) => p.path === comport);

      if (portExists && (!port || deviceRemoved || !port?.isOpen)) {
        console.log("Device detected on port.");
        await startLogging(); // Restart logging
      }
    } catch (err) {
      console.error("Error checking ports:", err);
    }
  }, 5000); // Check every 5 seconds
};

// Initialize logging on application start if autoLog is enabled
const initializeLogging = async () => {
  const config = loadConfig();
  if (config && config.mongoConfig.url) {
    // call function to initialize mongo DB
    initMongoDB(config.mongoConfig.url);
  }
  if (config) {
    // call function to start logging and monitor serial port
    monitorSerialPort(config);
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

export const getConfig = async (req, res) => {
  try {
    // Fetch config from the config file
    const configPath = path.join(configDir, "serialLog.config.json");
    let config = {};

    if (fs.existsSync(configPath)) {
      config = fs.readFileSync(configPath, "utf8");
    }
    res.status(200).json(JSON.parse(config) || {});
  } catch (error) {
    res.status(500).json({
      message: `Failed to get config file from file system: ${error.message}`,
    });
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
    // Fetch logs from the database
    const dbLogs = await Log.find({
      timestamp: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lt: new Date(`${date}T23:59:59.999Z`),
      },
    });

    // Fetch logs from the log file
    const logFilePath = path.join(logDir, `${date}.txt`);
    let fileLogs = [];

    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, "utf8");
      fileLogs = fileContent
        .split("\n")
        .filter((log) => log)
        .map((log) => {
          const [timestamp, ...data] = log.split(" - ");
          return { timestamp, data: data.join(" - ") };
        });
    }

    // Combine logs from both sources
    const combinedLogs = { file: fileLogs, db: dbLogs };

    res.status(200).json(combinedLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// api function to retrive only today logs
export const todayLogs = async (req, res) => {
  try {
    // Fetch logs from the log file
    const logFilePath = path.join(logDir, `todayLog.txt`);
    let fileLogs = [];

    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, "utf8");
      fileLogs = fileContent
        .split("\n")
        .filter((log) => log)
        .map((log) => {
          const [timestamp, ...data] = log.split(" - ");
          return { timestamp, data: data.join(" - ") };
        });
    }

    res.status(200).json(fileLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// api function for delete requested logs by date
const deleteLogFile = (date) => {
  // Delete log files
  const logFile = path.join(logDir, `${date}.txt`);
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
  }
};
const deleteLogFromDB = async (date) => {
  // Delete logs from database
  await Log.deleteMany({
    timestamp: {
      $gte: new Date(`${date}T00:00:00.000Z`),
      $lt: new Date(`${date}T23:59:59.999Z`),
    },
  });
};
export const deleteLogsByDate = async (req, res) => {
  const { date } = req.params;
  const { option } = req.body;
  try {
    if (option === "deleteFromDB") {
      deleteLogFromDB(date);
    } else if (option === "deleteFromFile") {
      deleteLogFile(date);
    } else if (option === "deleteFromBoth") {
      deleteLogFromDB(date);
      deleteLogFile(date);
    }

    res.status(200).json({ message: "Logs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function for building logs index
export const updateLogIndexes = async (req, res) => {
  const indexes = await updateIndexes();
  res.status(200).json(indexes);
};
// api call for return logs index
export const getLogIndexes = (req, res) => {
  const indexes = getLatestIndexes();
  res.status(200).json(indexes);
};
