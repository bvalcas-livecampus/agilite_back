const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authRouter = require("./src/router/auth");
const userRouter = require("./src/router/user");

app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
