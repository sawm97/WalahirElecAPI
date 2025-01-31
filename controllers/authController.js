const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByIdentifier } = require('../models/userModel');
require('dotenv').config();

let refreshTokens = [];

async function register(req, res) {
    const { username, email, password, role} = req.body;

    if (!username || !email || !password ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        await createUser(username, email, hashedPassword, role || 'guest');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function login(req, res) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Email and password are required', IsValid: false });
    }

    try {
        const user = await getUserByIdentifier(identifier);
        if (!user) return res.status(401).json({ message: 'Invalid credentials', IsValid: false });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials', IsValid: false });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken, IsValid: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
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

function refreshToken(req, res) {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
}

module.exports = { register, login, refreshToken };
