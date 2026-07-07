const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DB_URL || 'mongodb://localhost:27017/tax_planner';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4 // Force IPv4 to fix DNS resolution issues on Windows for SRV records
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`);
    console.warn('Server will continue without database. Some features will not work.');
    return false;
  }
};

module.exports = connectDB;
