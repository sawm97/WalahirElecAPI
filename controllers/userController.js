const { getAllUsers, createUser } = require('../models/userModel');

async function fetchUsers(req, res) {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function addUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = password; // 🔴 Gantilah dengan bcrypt hash di implementasi nyata
        await createUser(username, email, hashedPassword);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { fetchUsers, addUser };
