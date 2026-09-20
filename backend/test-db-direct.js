const mongoose = require('mongoose');

async function test() {
  try {
    console.log('Connecting to MongoDB directly...');
    const uri = 'mongodb://manitrisha:Mani123@ac-yzr3hsx-shard-00-00.rncr4rx.mongodb.net:27017,ac-yzr3hsx-shard-00-01.rncr4rx.mongodb.net:27017,ac-yzr3hsx-shard-00-02.rncr4rx.mongodb.net:27017/TAX-PLANNER?ssl=true&replicaSet=atlas-yzr3hsx-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(uri, {
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
