const db = require('../db'); // Adjust path as needed

// Get user by ID
async function getUserById(userId) {
    return db('users').where({ id: userId }).first();
}

// Get user by email
async function getUserByEmail(email) {
    return db('users').where({ email: email }).first();
}

// Create a new user
async function createUser(userData) {
    return db('users').insert(userData).returning('*');
}

// Update user by ID
async function updateUser(userId, updates) {
    return db('users').where({ id: userId }).update(updates).returning('*');
}

// Delete user by ID
async function deleteUser(userId) {
    return db('users').where({ id: userId }).del();
}

// List all users
async function getAllUsers() {
    return db('users').select('*');
}

module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
};