const CustomError = require("../errors");
const {isTokenValid} = require("../utils");

const authenticationMiddleware = (req, res, next) => {
    // check the token presence.
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomError.UnAuthenticatedError("Authentication invalid");
    }
    try {
        const {name, role, userId} = isTokenValid(token);
        req.user = {name, role, userId};
        next();
    } catch (error) {
        throw new CustomError.UnAuthenticatedError("Authentication invalid");
    }
}

module.exports = authenticationMiddleware;