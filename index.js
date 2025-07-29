import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { openDb, initDb } from "./db.js";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import { JWT_SECRET, PORT } from "./config/config.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);

let db;
await initDb();
db = await openDb();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// ======================
app.listen(PORT, () => {
    console.log("Backend Film API listening on port " + PORT);
});
