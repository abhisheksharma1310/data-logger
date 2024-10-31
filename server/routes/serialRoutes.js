import express from "express";
import {
  configure,
  checkSerialStatus,
  getLogsByDate,
  deleteLogsByDate,
  initSocketIo,
} from "../controllers/serialController.js";

const router = express.Router();

const serialRouter = (io) => {
  router.post("/configure", configure);
  router.get("/status", checkSerialStatus);
  router.get("/logs/:date", getLogsByDate);
  router.delete("/logs/:date", deleteLogsByDate);
  initSocketIo(io);

  return router;
};

export default serialRouter;
