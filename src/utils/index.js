const {createJWT, isTokenValid, attachCookiesToResponse} = require("./jwt");
const hashPassword = require("./hashPassword");
const createTokenUser = require("./createTokenUser");
const checkPermission = require("./checkPermission");

module.exports = {
    createJWT, 
    isTokenValid,
    attachCookiesToResponse,
    hashPassword,
    createTokenUser,
    checkPermission
}