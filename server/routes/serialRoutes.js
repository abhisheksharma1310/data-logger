import express from "express";
import {
  configure,
  getConfig,
  checkSerialStatus,
  getLogsByDate,
  todayLogs,
  deleteLogsByDate,
  updateLogIndexes,
  getLogIndexes,
  initSocketIo,
} from "../controllers/serialController.js";

const router = express.Router();

const serialRouter = (io) => {
  router.post("/configure", configure);
  router.get("/configure", getConfig);
  router.get("/status", checkSerialStatus);
  router.get("/todayLogs", todayLogs);
  router.get("/logs/:date", getLogsByDate);
  router.delete("/logs/:date", deleteLogsByDate);
  router.post("/logsUpdateIndexes", updateLogIndexes);
  router.get("/logsIndexes", getLogIndexes);
  initSocketIo(io);

  return router;
};

export default serialRouter;
