import express from "express";
import {
  configureSerialPort,
  getLogsByDate,
  deleteLogsByDate,
} from "../controllers/serialController.js";

const router = express.Router();

const serialRouter = (io) => {
  router.post("/configure", (req, res) => configureSerialPort(req, res, io));
  router.get("/logs/:date", getLogsByDate);
  router.delete("/logs/:date", deleteLogsByDate);

  return router;
};

export default serialRouter;
