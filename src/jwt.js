const User = require('./database/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = () => async (req, res) => {
    try {
        console.log("INFO: Register endpoint called");
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            console.error("Registration failed: Missing fields");
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Registration failed: Email already registered =", email);
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
            console.error("Login failed: Missing fields");
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            console.error("Login failed: Invalid email =", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error("Login failed: Invalid password for email =", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const userAgent = req.headers['user-agent'];
        const accessToken = generateAccessToken(userAgent, user); 
        console.log("INFO: User logged in successfully, email =", user.email);
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const authenticateToken = (req, res, next) => {
    console.log("INFO: authenticateToken middleware called");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.error("Access token missing in request");
        return res.status(401).json({ message: 'Access token is required' });
    }
    try {
        const userAgent = req.headers['user-agent'];
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (user.userAgent !== userAgent) {
            console.error("Access token user agent mismatch");
            return res.status(403).json({ message: 'Invalid access token' });
        }
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
    authenticateToken
};

function generateAccessToken(userAgent, user) {
    const userId = user.id || user._id;
    const payload = {
        id: userId,
        email: user.email,
        username: user.username,
        userAgent: userAgent
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2d' });
}