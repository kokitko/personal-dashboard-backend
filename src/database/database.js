const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

module.exports = mongoose;
