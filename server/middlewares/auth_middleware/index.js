const jwt = require('jsonwebtoken');
const ApiResponse = require('../../utils/api_response');


class auth_middleware {
    constructor() {
        this.secret = process.env.JWT_TOKEN || 'default_secret_key';

        this.verify_token = this.verify_token.bind(this);
        this.verify_role = this.verify_role.bind(this);
    };

    verify_token = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return ApiResponse.error(res, "Token missing", 401);
        }
        const token = authHeader.split(" ")[1];

        jwt.verify(token, this.secret, (err, decoded) => {
            if (err) {
                return ApiResponse.error(res, "Invalid token", 403);
            }

            req.user = decoded;
            next();
        });
    }

    verify_role = (...allowedRoles) => {
        return (req, res, next) => {
            const userRole = req?.user?.user_role;
            if (!allowedRoles.includes(userRole)) {
                return ApiResponse.error(res, "Access denied", 403);
            }
            next();
        };
    }

}

module.exports = new auth_middleware;
