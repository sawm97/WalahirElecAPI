const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByIdentifier, createUser } = require('../models/userModel');
const { storeRefreshToken, removeRefreshToken, findUserByRefreshToken } = require('../models/refreshTokenModel')

require('dotenv').config();

let refreshTokens = [];


// FUNGSI REGISTER
async function register(req, res) {
    const { username, email, password, role} = req.body;

    if (!username || !email || !password ) {
        return res.status(400).json({ 
            status: 'error', 
            IsSuccess: false, 
            message: 'All fields are required' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        await createUser(username, email, hashedPassword, role || 'guest');
        res.status(201).json({ 
            status: 'success', 
            IsSuccess: true, 
            message: 'User registered successfully' 
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error', 
            IsSuccess: false, 
            message: err.message 
        });
    }
}


// FUNGSI LOGIN
async function login(req, res) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ 
            status: 'error',
            IsValid: false,
            message: 'Email and password are required' 
        });
    }

    try {
        const user = await getUserByIdentifier(identifier);
        if (!user) return res.status(401).json({ 
            status: 'error',
            IsValid: false,
            message: 'Invalid credentials' 
        });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ 
            status: 'error',
            IsValid: false,
            message: 'Invalid credentials' 
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Simpan refreshToken di database
        await storeRefreshToken(user.id, refreshToken);

        // const expiresMinute = process.env.REFRESH_TOKEN_EXPIRY / 1440;
        // res.cookie("refreshToken", refreshToken, {
        //     expires: expiresMinute,
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "Strict"
        // });

        res.json({ 
            status: 'success', 
            IsValid: true,
            accessToken, 
            refreshToken,
            role: user.role,
            userId: user.id
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            IsValid: false,
            message: err.message 
        });
    }
}

function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRY }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Misalnya: 7 hari
    );
}


//FUNGSI LOGOUT
async function logout(req, res) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(204).send(); // No content

        // Hapus refreshToken dari database
        await removeRefreshToken(refreshToken);

        res.clearCookie("refreshToken");
        res.json({ 
            status: 'success',
            IsSuccess: true,
            message: "Logout berhasil" 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            IsSuccess: false,
            message: "Error saat logout" 
        });
    }
}


//FUNGSI REFRESH TOKEN
async function refreshToken(req, res) {
    const { token } = req.body;
    if (!token) return res.status(401).json({ 
        status: 'error',
        IsSuccess: false,
        message: "Token diperlukan" 
    });

    try {
        const user = await findUserByRefreshToken(token);
        if (!user) return res.status(403).json({ 
            status: 'error',
            IsSuccess: false,
            message: "Token tidak valid atau sudah logout" 
        });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ 
                status: 'error',
                IsSuccess: false,
                message: "Token tidak valid" 
            });

            const newAccessToken = generateAccessToken(user);
            res.json({ 
                status: 'success',
                IsSuccess: true,
                accessToken: newAccessToken 
            });
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            IsSuccess: false,
            message: "Database error" 
        });
    }
}

module.exports = { 
    register, 
    login, 
    logout, 
    refreshToken 
};
