import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Log from "../models/logModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../logData");
const logIndexDir = path.join(__dirname, "../logIndex");
const fileLogsIndexPath = path.join(logIndexDir, "fileLogsIndex.json");
const dbLogsIndexPath = path.join(logIndexDir, "dbLogsIndex.json");

// Ensure logIndex directory exists
if (!fs.existsSync(logIndexDir)) {
  fs.mkdirSync(logIndexDir);
}

const updateIndexes = async () => {
  try {
    // File logs index
    const fileLogsIndex = [];
    const files = fs.readdirSync(logDir);
    files.forEach((file) => {
      const [date] = file.split(".");
      if (!fileLogsIndex.includes(date)) {
        fileLogsIndex.push(date);
      }
    });
    fs.writeFileSync(fileLogsIndexPath, JSON.stringify(fileLogsIndex, null, 2));

    // Database logs index
    const dbLogsIndex = await Log.distinct("timestamp");
    const uniqueDates = Array.from(
      new Set(
        dbLogsIndex.map((timestamp) => timestamp.toISOString().split("T")[0])
      )
    );
    fs.writeFileSync(dbLogsIndexPath, JSON.stringify(uniqueDates, null, 2));

    return { fileLogsIndex, dbLogsIndex: uniqueDates };
  } catch (error) {
    console.error("Error updating indexes:", error);
    return { error: error.message };
  }
};

const getLatestIndexes = () => {
  try {
    const fileLogsIndex = JSON.parse(
      fs.readFileSync(fileLogsIndexPath, "utf8")
    );
    const dbLogsIndex = JSON.parse(fs.readFileSync(dbLogsIndexPath, "utf8"));

    return { fileLogsIndex, dbLogsIndex };
  } catch (error) {
    console.error("Error retrieving indexes:", error);
    return { error: error.message };
  }
};

export { updateIndexes, getLatestIndexes };
