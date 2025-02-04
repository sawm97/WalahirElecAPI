const { getAllUsers } = require('../models/userModel');
const { upsertUserDetail } = require('../models/userDetailModel');

// GET USER
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

// UPDATE USER DETAIL
async function updateProfile(req, res) {
    try {
        const userId = req.user.id; // ID dari token JWT
        const { address, phoneNumber, birthDate } = req.body;

        if (!address || !phoneNumber || !birthDate) {
            return res.status(400).json({ 
                status: 'error',
                IsSuccess: false, 
                message: 'Semua field harus diisi' 
            });
        }

        const updateResult = await upsertUserDetail(userId, address, phoneNumber, birthDate);

        if (!updateResult.success) {
            return res.status(500).json({ 
                status: 'error',
                IsSuccess: false, 
                message: updateResult.error 
            });
        }

        res.json({ 
            status: 'success', 
            IsSuccess: true,
            message: updateResult.message 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error',
            IsSuccess: false, 
            message: 'Terjadi kesalahan server' 
        });
    }
}


module.exports = { fetchUsers, updateProfile };
