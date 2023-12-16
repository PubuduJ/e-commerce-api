const CustomError = require("../errors");

const authorizationMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        throw new CustomError.UnAuthorizedError("Unauthorized to access this route");
    }
    next();
}

module.exports = authorizationMiddleware;