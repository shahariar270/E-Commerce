const jwt = require('jsonwebtoken');
// require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


class auth_middleware {
    constructor() {
        this.secret = process.env.JWT_TOKEN || 'default_secret_key';

        this.verify_token = this.verify_token.bind(this);
        this.verify_role = this.verify_role.bind(this);
    };

    verify_token = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token missing" });
        }
        const token = authHeader.split(" ")[1];

        jwt.verify(token, this.secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }

            req.user = decoded;
            next();
        });
    }

    verify_role = (...allowedRoles) => {
        return (req, res, next) => {
            const userRole = req?.user?.user_role;
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Access denied" });
            }
            next();
        };
    }

}

module.exports = new auth_middleware;