const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { status: "fail", data: { error: "Too many requests, please try again later." } }
});

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100, 
    message: { status: "fail", data: { error: "Too many requests, please try again later." } }
});

module.exports = { authLimiter, generalLimiter };