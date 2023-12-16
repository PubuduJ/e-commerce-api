const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
}

const isTokenValid = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

const attachCookiesToResponse = (res, tokenUser) => {
    // Send JWT using a cookie instead of sending it on response payload.
    const token = createJWT(tokenUser);
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDayInMilliseconds),
        // signed the cookie with JWT_SECRET.
        signed: true
    })
    return res;
}

module.exports = {createJWT, isTokenValid, attachCookiesToResponse};