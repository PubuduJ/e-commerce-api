const { StatusCodes } = require('http-status-codes');
const User = require("../models/User");
const {hashPassword} = require("../utils")
const CustomError = require("../errors");
const {createTokenUser, attachCookiesToResponse, checkPermission} = require("../utils");

const getAllUsers = async (req, res) => {
    // get all users which role has user without getting the password field.
    const users = await User.find({ role: "user" }).select("-password");
    res.status(StatusCodes.OK).json({ users });
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).select("-password");
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
    }
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json(req.user);
}

const updateUser = async (req, res) => {
    const {email, name} = req.body;
    if (!email || !name) {
        throw new CustomError.BadRequestError("Please provide all values");
    }
    const user = await User.findOneAndUpdate({_id: req.user.userId}, {email, name}, {new: true, runValidators: true});
    const tokenUser = createTokenUser(user);
    res = attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.CREATED).json(tokenUser);
}

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError("Please provide old password and new password");
    }
    const user = await User.findOne({_id:req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnAuthenticatedError("Invalid credentials");
    }
    user.password = await hashPassword(newPassword);

    await User.findOneAndUpdate({_id:req.user.userId}, user, {new:true, runValidators:true});
    res.status(StatusCodes.CREATED).json({message: `Password updated successfully on user id: ${req.user.userId}`});
}

module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword};