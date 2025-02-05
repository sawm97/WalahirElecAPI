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

        const isMatch = await bcrypt.compare(password, user.data.password_hash);
        if (!isMatch) return res.status(401).json({ 
            status: 'error',
            IsValid: false,
            message: 'Invalid credentials' 
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Simpan refreshToken di database
        await storeRefreshToken(user.data.id, refreshToken);

        res.json({ 
            status: 'success', 
            IsValid: true,
            accessToken, 
            refreshToken,
            role: user.data.role,
            userId: user.data.id
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
    const jwtExpiry = process.env.JWT_EXPIRY || "3m"
    const tokenJwt = jwt.sign(
        { id: user.data.id, username: user.data.username, role: user.data.role },
        process.env.JWT_SECRET, 
        { expiresIn: jwtExpiry }
    );

    // Debug: Tampilkan waktu expiry dalam zona waktu lokal
    const decoded = jwt.decode(tokenJwt);
    console.log("JWT Token Expiry (UTC):", new Date(decoded.exp * 1000));
    console.log("JWT Token Expiry (Local):", new Date(decoded.exp * 1000).toLocaleString());

    return tokenJwt;
}

function generateRefreshToken(user) {
    const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7m"
    const tokenRefresh = jwt.sign(
        { id: user.data.id, role: user.data.role }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: refreshExpiry } // Misalnya: 7 hari
    );

    // Debug: Tampilkan waktu expiry dalam zona waktu lokal
    const decoded = jwt.decode(tokenRefresh);
    console.log("Refresh Token Expiry (UTC):", new Date(decoded.exp * 1000));
    console.log("Refresh Token Expiry (Local):", new Date(decoded.exp * 1000).toLocaleString());

    return tokenRefresh;
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
    console.log("Received Refresh Token:", token); // Debugging
    if (!token) return res.status(401).json({ 
        status: 'error',
        IsSuccess: false,
        message: "Token diperlukan" 
    });

    try {
        const user = await findUserByRefreshToken(token);
        console.log("User Found:", user); // Debugging
        if (!user) return res.status(403).json({ 
            status: 'error',
            IsSuccess: false,
            message: "Token tidak valid atau sudah logout" 
        });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT Verify Error:", err); // Debugging
                return res.status(403).json({ 
                    status: 'error',
                    IsSuccess: false,
                    message: "Token tidak valid" 
                });
            }

            console.log("Decoded Token:", decoded); // Debugging

            const newAccessToken = generateAccessToken(user);
            res.json({ 
                status: 'success',
                IsSuccess: true,
                accessToken: newAccessToken 
            });
        });
    } catch (error) {
        console.error("Error in refreshToken function:", error); // Debugging
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
