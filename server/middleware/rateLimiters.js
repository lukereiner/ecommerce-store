const rateLimit = require("express-rate-limit");

const cartLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15mins
    max: 1000, // Limit each IP to 100 reqs per window
    message: "Too many requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

const checkoutLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // one hour
    max: 500, // 5 reqs per hour
    message: "Too many requests. Please try again later.",
});

module.exports = {
    cartLimiter,
    checkoutLimiter
}