require('dotenv').config();
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  
  await mongoose.connect('mongodb://localhost:27018/test');
}

module.exports = mongoose;