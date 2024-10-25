// routes/serialRoutes.js
import express from "express";
import {
  configureSerialPort,
  startDataLogging,
  getLogsByDate,
} from "../controllers/serialController.js";

const router = express.Router();

const serialRouter = (io) => {
  router.post("/configure", (req, res) => configureSerialPort(req, res, io));
  router.post("/start-logging", (req, res) => startDataLogging(req, res, io));
  router.get("/logs/:date", getLogsByDate);

  return router;
};

export default serialRouter;
