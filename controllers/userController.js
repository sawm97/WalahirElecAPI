const { getAllUsers } = require('../models/userModel');


async function fetchUsers(req, res) {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = { fetchUsers };
