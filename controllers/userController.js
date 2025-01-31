const { getAllUsers } = require('../models/userModel');


async function fetchUsers(req, res) {
    try {
        const users = await getAllUsers();
        res.json({ 
            status: 'success', 
            IsSuccess: true, 
            users 
        });
    } catch (err) {
        res.status(500).json({
            status: 'error', 
            IsSuccess: false, 
            message: err.message 
        });
    }
}


module.exports = { fetchUsers };
