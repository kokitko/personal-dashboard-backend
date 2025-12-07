const express = require('express');
const app = express();
const db = require('./database/database');
const { register, login, token } = require('./jwt');

const PORT = process.env.PORT || 3000;
app.use(express.json());

app.post('/register', register());
app.post('/login', login());
app.post('/token', token());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;