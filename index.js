const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authRouter = require("./src/router/auth");
const userRouter = require("./src/router/user");
const movieRouter = require("./src/router/movie");

app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/movies", movieRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
