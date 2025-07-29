const express = require("express");
const router = express.Router();
const userController = require('../controller/user');
const authenticate = require('../middleware/authentification');

// Get all users (protected route)
router.get("/", authenticate, userController.getAllUsers);

// Get user by ID (protected route)
router.get("/:id", authenticate, userController.getUserById);

// Create a new user (protected route - admin only)
router.post("/", authenticate, userController.createUser);

// Update user by ID (protected route)
router.put("/:id", authenticate, userController.updateUser);

// Delete user by ID (protected route - admin only)
router.delete("/:id", authenticate, userController.deleteUser);

module.exports = router;
