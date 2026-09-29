const bcrypt = require("bcryptjs");

bcrypt.hash("D@rshil@123", 10).then((hash) => {
    console.log(hash);
});