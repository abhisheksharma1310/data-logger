import express from "express";
import {
  configure,
  checkSerialStatus,
  getLogsByDate,
  deleteLogsByDate,
} from "../controllers/serialController.js";

const router = express.Router();

const serialRouter = (io) => {
  router.post("/configure", configure);
  router.get("/status", (req, res) => checkSerialStatus(req, res, io));
  router.get("/logs/:date", getLogsByDate);
  router.delete("/logs/:date", deleteLogsByDate);

  return router;
};

export default serialRouter;
