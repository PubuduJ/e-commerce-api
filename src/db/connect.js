const mongoose = require('mongoose');

const {
    MONGODB_HOST,
    MONGODB_PORT,
    MONGODB_DATABASE,
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_AUTHENTICATION_DATABASE
} = process.env;

const mongoURI = `mongodb://${MONGODB_USERNAME}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=${MONGODB_AUTHENTICATION_DATABASE}`;

const connectDB = () => {
    return mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = connectDB;