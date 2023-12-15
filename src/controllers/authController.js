const { StatusCodes } = require('http-status-codes');
const User = require("../models/User");
const CustomError = require("../errors");
const {createJWT} = require("../utils")

const registerUser = async (req, res) => {
    // unique email validation can also be done using User schema unique: true property at the email field.
    const { email, name, password } = req.body;
    const isExist = await User.findOne({email});
    if (isExist) {
        throw new CustomError.BadRequestError("Email already exists");
    }
    // first registered user, role is an admin, rest has the role as user.
    const userCount = await User.countDocuments({});
    const role = (userCount === 0) ? "admin" : "user";

    const user = await User.create({ name, email, password, role });
    const tokenUser = {name: user.name, userId: user._id, role: user.role}

    const token = createJWT(tokenUser);

    // Send JWT using a cookie instead of sending it on response payload.
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
    
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDayInMilliseconds)
    })

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

const loginUser = async (req, res) => {
    res.status(StatusCodes.CREATED).json({message: "login"});
}

const logoutUser = async (req, res) => {
    res.status(StatusCodes.OK).json({message: "logout"});
}

module.exports = {registerUser, loginUser, logoutUser};