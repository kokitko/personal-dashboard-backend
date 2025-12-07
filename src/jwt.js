const User = require('./database/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = () => async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).json({ message: 'Email is already registered' });
            next();
            return;
        }
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
        next();
        return;
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const login = () => async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        next();
        return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        next();
        return;
    }
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username
    };
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
};

const token = () => (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' });
        next();
        return;
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'Invalid refresh token' });
            next();
            return;
        }
        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);
        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    });
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