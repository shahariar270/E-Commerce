const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_token = process.env.JWT_TOKEN

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, jwt_token, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;