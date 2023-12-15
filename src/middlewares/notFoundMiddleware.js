const { StatusCodes } = require('http-status-codes');

const notFoundMiddleware = (req, res) => {
    res.status(StatusCodes.BAD_REQUEST).json({message: 'Route does not exist'});
}

module.exports = notFoundMiddleware;
