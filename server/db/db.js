const mongoose = require('mongoose');

function connectToDb() {
    return mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    });
}

module.exports = connectToDb;