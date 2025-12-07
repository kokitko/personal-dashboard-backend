const User = require('./database/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = () => async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const login = () => async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const token = () => async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

module.exports = {
    register,
    login,
    token
};

function generateRefreshToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username
    };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function generateAccessToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}