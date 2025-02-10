const bcrypt = require('bcryptjs');
const { getAllUsers, getUserById, updateUser, getUserPasswordHash, updateUserPassword, saveUserImage, getUserImageById } = require('../models/userModel');
const { upsertUserDetail } = require('../models/userDetailModel');
const { uploadToAzureBlob } = require('../helpers/azureBlobHelper');
const { get } = require('../routes/usersRoutes');

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

// GET USER BY IDENTIFIER
async function getUser(req, res) {
    const { identifier } = req.params; // username atau email dari request parameter

    try {
        const user = await getUserById(identifier);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                IsSuccess: false,
                message: 'User tidak ditemukan'
            });
        }

        res.json({
            status: 'success',
            IsSuccess: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: 'Terjadi kesalahan saat mengambil data user'
        });
    }
}

// UPDATE USER
async function updateUserProfile(req, res) {
    const userId = req.user.id; // ID dari token JWT
    const { username, email, oldPassword, newPassword } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID tidak ditemukan di token" });
    } else {
        console.log("User ID dari token:", req.user.id);
    }

    try {
        // Cek apakah username & email diupdate
        if (username || email) {
            const updateResult = await updateUser(userId, username, email);
            if (!updateResult.success) {
                return res.status(500).json({ 
                    status: 'error',
                    IsSuccess: false, 
                    message: 'Gagal update username atau email' 
                });
            }
        }

        // Jika password ingin diubah, validasi oldPassword
        if (oldPassword && newPassword) {
            const storedPasswordHash = await getUserPasswordHash(userId);
            if (!storedPasswordHash) {
                return res.status(404).json({ 
                    status: 'error',
                    IsSuccess: false, 
                    message: 'User tidak ditemukan' 
                });
            }

            // Cek apakah password lama benar
            const isMatch = await bcrypt.compare(oldPassword, storedPasswordHash);
            if (!isMatch) {
                return res.status(400).json({ 
                    status: 'error',
                    IsSuccess: false, 
                    message: 'Password lama salah' 
                });
            }

            // Hash password baru dan update
            const salt = await bcrypt.genSalt(10);
            const newPasswordHash = await bcrypt.hash(newPassword, salt);
            const passwordUpdateResult = await updateUserPassword(userId, newPasswordHash);
            if (!passwordUpdateResult.success) {
                return res.status(500).json({ 
                    status: 'error',
                    IsSuccess: false, 
                    message: 'Gagal update password' 
                });
            }
        }

        res.json({ 
            status: 'success', 
            IsSuccess: true,
            message: 'Profile berhasil diperbarui' 
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ 
            status: 'error',
            IsSuccess: false, 
            message: 'Terjadi kesalahan pada server' 
        });
    }
}

// UPLOAD PROFILE PICTURE
async function uploadProfilePicture(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                status: 'error',
                IsSuccess: false, 
                message: 'File tidak ditemukan' 
            });
        }

        const fileBuffer = req.file.buffer;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const mimeType = req.file.mimetype;

        const imageUrl = await uploadToAzureBlob(fileBuffer, fileName, mimeType);

        // Menyimpan URL gambar ke database
        const userId = req.user.id; // Pastikan user sudah terautentikasi
        await saveUserImage(userId, imageUrl);

        // Simpan URL gambar ke database jika diperlukan
        res.status(200).json({ 
            status: 'success', 
            IsSuccess: true, 
            imageUrl 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            IsSuccess: false, 
            message: 'Gagal mengunggah gambar' 
        });
    }
}

// GET USER IMAGE
async function viewImage(req, res) {
    try {
        console.log("viewImage - User ID from token:", req.user.id); // Tambahkan log ini
        const userId = req.user.id; // Ambil userId dari token JWT

        const imageUrl = await getUserImageById(userId);
        if (!imageUrl) {
            console.log("Image not found for user ID:", userId); // Tambahkan log ini
            return res.status(404).json({ 
                status: 'error',
                IsSuccess: false,  
                message: 'Image not found' 
            });
        }

        console.log("Image URL found:", imageUrl); // Tambahkan log ini
        res.status(200).json({ 
            status: 'success', 
            IsSuccess: true, 
            image_url: imageUrl 
        });
    } catch (error) {
        console.error("Error getting user image:", error);
        res.status(500).json({ 
            status: 'error',
            IsSuccess: false,  
            message: 'Server error' 
        });
    }
}

module.exports = { 
    fetchUsers, 
    updateProfile, 
    getUser, 
    updateUserProfile, 
    uploadProfilePicture, 
    viewImage 
};
