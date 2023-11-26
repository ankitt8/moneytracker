const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
module.exports = connectDB;
