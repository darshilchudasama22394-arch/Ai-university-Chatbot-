const bcrypt = require("bcryptjs");

async function generateHash() {
  const hash = await bcrypt.hash("D@rshil@123", 10);
  console.log("New Hash:");
  console.log(hash);
}

generateHash();