const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authenticateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({status: "Unauthourized", message: "Access token is missing or invalid"});
                throw new Error('Unauthourized');
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({status: "Unauthourized", message: "Access token is missing or invalid"});
    }
});

module.exports = authenticateToken;