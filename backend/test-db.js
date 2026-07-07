const mongoose = require('mongoose');

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb+srv://manitrisha:Mani123@cluster0.rncr4rx.mongodb.net/TAX-PLANNER?appName=Cluster0', {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('Connected successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}
test();
