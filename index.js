const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const authRouter = require("./src/router/auth");
const userRouter = require("./src/router/user");
const movieRouter = require("./src/router/movie");
const { PORT } = require("./src/config/config.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Film API!");
});
app.use("/auth", authRouter);
app.use("/movies", movieRouter);
app.use("/users", userRouter);

// ======================
app.listen(PORT, () => {
    console.log("Backend Film API listening on port " + PORT);
});

module.exports = app;
