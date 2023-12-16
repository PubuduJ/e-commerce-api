const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    // salt is random bytes, 10 random bytes will get here.
    const salt = await bcrypt.genSalt(10);
    // this, is pointed to the document.
    return await bcrypt.hash(password, salt);
}

module.exports = hashPassword;