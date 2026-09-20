const mongoose = require('mongoose');
const dns = require('dns');

const dnsServers = (process.env.MONGO_DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map(server => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.DB_URL || 'mongodb://localhost:27017/tax_planner';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
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
