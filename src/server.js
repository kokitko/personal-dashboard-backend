const express = require('express');
const app = express();
const db = require('./database/database');

const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Personal Dashboard Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});