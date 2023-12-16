const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        // custom validator
        validate: {
            // validate email with validator package.
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

UserSchema.methods.hashPassword = async function(password) {
    // salt is random bytes, 10 random bytes will get here.
    const salt = await bcrypt.genSalt(10);
    // this, is pointed to the document.
    return await bcrypt.hash(password, salt);
}

// schema instance method to compare hashed password with login password.
UserSchema.methods.comparePassword = async function(candidatePassword) {
    // this.password is the password from the document.
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);