const express = require("express");
const router = express.Router();
const authController = require('../controller/auth');

router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/logout", authController.logout);

module.exports = router;