const mongoose = require('mongoose');

// Create Database Connection
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
        console.log('Connected to DB' , connect.connection.name);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;