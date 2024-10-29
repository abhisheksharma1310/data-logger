import express from "express";
const router = express.Router();
import { verify } from "../controllers/verifyController.js";

router.get("/verify", verify);

export default router;
