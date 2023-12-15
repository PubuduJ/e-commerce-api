const CustomApiError = require('./customApiError');
const UnAuthenticatedError = require('./unAuthenticatedError');
const NotFoundError = require('./notFoundError');
const BadRequestError = require('./badRequestError');

module.exports = {CustomAPIError: CustomApiError, UnauthenticatedError: UnAuthenticatedError, NotFoundError, BadRequestError};