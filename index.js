import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { openDb, initDb } from "./db.js";

const authRouter = require("./src/router/auth");
const userRouter = require("./src/router/user");
import { JWT_SECRET, PORT } from "./config/config.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db;
await initDb();
db = await openDb();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);

// ======================
app.listen(PORT, () => {
    console.log("Backend Film API listening on port " + PORT);
});

module.exports = app;
