const express = require('express');
const app = express();
const db = require('./database/database');
const { register, login, token, authenticateToken } = require('./jwt');
const { weather, crypto, news, currency } = require('./boardEndpoints');
const { addTodo, getTodos, toggleCompleteTodo, deleteTodo } = require('./todo');

const PORT = process.env.PORT || 3000;
app.use(express.json());

app.post('/register', register());
app.post('/login', login());
app.post('/token', token());

app.get('/weather', weather());
app.get('/crypto', crypto());
app.get('/news', news());
app.get('/currency', currency());

app.post('/todo', authenticateToken, addTodo);
app.get('/todo', authenticateToken, getTodos);
app.put('/todo/:id/toggle', authenticateToken, toggleCompleteTodo);
app.delete('/todo/:id', authenticateToken, deleteTodo);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;