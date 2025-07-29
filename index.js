const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const authRouter = require("./src/router/auth");
const userRouter = require("./src/router/user");
const { PORT } = require("./src/config/config.js");
const initDb = require("./src/data/db.js").initDb;

dotenv.config();

initDb()
    .then(() => {
        console.log("Database initialized successfully.");
    })
    .catch((err) => {
        console.error("Error initializing database:", err);
        process.exit(1);
    });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/movies", movieRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
