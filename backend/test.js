require("dotenv").config();
const mongoose = require("mongoose");

console.log("Mongo URL:", process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Full Error:");
    console.error(err);
    process.exit(1);
  });