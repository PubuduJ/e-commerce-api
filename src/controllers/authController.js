const { StatusCodes } = require('http-status-codes');
const User = require("../models/User");
const CustomError = require("../errors");
const {attachCookiesToResponse, hashPassword, createTokenUser} = require("../utils")

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

    const hash = await hashPassword(password);
    console.log(hash);

    const user = await User.create({ name, email, password: hash, role });
    const tokenUser = createTokenUser(user);

    res = attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError.UnAuthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new CustomError.UnAuthenticatedError("Invalid credentials");
    }

    const tokenUser = createTokenUser(user);

    res = attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

const logoutUser = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({message: "user logout successfully"});
}

module.exports = {registerUser, loginUser, logoutUser};