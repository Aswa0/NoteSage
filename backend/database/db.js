const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

function connDB() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}

module.exports = connDB;