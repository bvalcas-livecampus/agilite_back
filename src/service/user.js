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
    // SQLite returns an array of inserted row IDs, so fetch the user after insert
    const [id] = await db('users').insert(userData);
    return getUserById(id);
}

// Update user by ID
async function updateUser(userId, updates) {
    await db('users').where({ id: userId }).update(updates);
    return getUserById(userId);
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