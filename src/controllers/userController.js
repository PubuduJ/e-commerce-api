const { StatusCodes } = require('http-status-codes');
const User = require("../models/User");
const CustomError = require("../errors");

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
    res.status(StatusCodes.OK).json({ user });
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({message: "show current user"});
}

const updateUser = async (req, res) => {
    res.status(StatusCodes.CREATED).json({message: "update user"});
}

const updateUserPassword = async (req, res) => {
    res.status(StatusCodes.CREATED).json({message: "update user password"});
}

module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword};