const User = require('./database/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = () => async (req, res) => {
    try {
        console.log("INFO: Register endpoint called");
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        console.log("INFO: User registered successfully, id =", newUser._id);
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const login = () => async (req, res) => {
    try {
        console.log("INFO: Login endpoint called");
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
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
        console.log("INFO: User logged in successfully, id =", user._id);
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const token = () => async (req, res) => {
    console.log("INFO: Token endpoint called");
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        console.log("INFO: Token refreshed successfully, user id =", user.id || user._id);
        return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

const authenticateToken = (req, res, next) => {
    console.log("INFO: authenticateToken middleware called");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }
    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        console.log("INFO: Access token verified, user id =", user.id || user._id);
        next();
    } catch (error) {
        console.error('Error verifying access token:', error);
        return res.status(403).json({ message: 'Invalid access token' });
    }
}

module.exports = {
    register,
    login,
    token,
    authenticateToken
};

function generateRefreshToken(user) {
    console.log("Generating refresh token for user id =", user.id || user._id);
    const userId = user.id || user._id;
    const payload = {
        id: userId,
        email: user.email,
        username: user.username
    };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function generateAccessToken(user) {
    console.log("Generating access token for user id =", user.id || user._id);
    const userId = user.id || user._id;
    const payload = {
        id: userId,
        email: user.email,
        username: user.username
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}