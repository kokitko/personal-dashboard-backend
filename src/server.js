const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./database/database');
require('dotenv').config();
const { register, login, token, logout, authenticateToken } = require('./jwt');
const { weather, crypto, news, currency } = require('./boardEndpoints');
const { addTodo, getTodos, toggleCompleteTodo, deleteTodo } = require('./todo');

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.post('/api/register', register());
app.post('/api/login', login());
app.post('/api/token', token());
app.post('/api/logout', logout());

app.get('/api/weather', weather());
app.get('/api/crypto', crypto());
app.get('/api/news', news());
app.get('/api/currency', currency());

app.post('/api/todo', authenticateToken, addTodo);
app.get('/api/todo', authenticateToken, getTodos);
app.put('/api/todo/:id/toggle', authenticateToken, toggleCompleteTodo);
app.delete('/api/todo/:id', authenticateToken, deleteTodo);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;