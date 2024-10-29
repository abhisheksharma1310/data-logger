// index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
//import mongoose from "mongoose";
import cors from "cors";
import serialRouter from "./routes/serialRoutes.js";
import verifyRouter from "./routes/verifyRoutes.js";
//import { databaseConfig } from "./config/databaseConfig.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
// mongoose
//   .connect(databaseConfig.url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB", err));

// Routers
app.use("/", verifyRouter);
app.use("/serial", serialRouter(io));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
