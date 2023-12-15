const { StatusCodes } = require('http-status-codes');

const registerUser = async (req, res) => {
    res.status(StatusCodes.CREATED).json({message: "register"});
}

const loginUser = async (req, res) => {
    res.status(StatusCodes.CREATED).json({message: "login"});
}

const logoutUser = async (req, res) => {
    res.status(StatusCodes.OK).json({message: "logout"});
}

module.exports = {registerUser, loginUser, logoutUser};