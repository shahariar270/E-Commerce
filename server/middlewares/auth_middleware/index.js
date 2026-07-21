const jwt = require('jsonwebtoken');
const ApiResponse = require('../../utils/api_response');


class auth_middleware {
    constructor() {
        this.secret = process.env.JWT_TOKEN;
        if (!this.secret) {
            throw new Error('FATAL: JWT_TOKEN environment variable is not set');
        }

        this.verify_token = this.verify_token.bind(this);
        this.verify_role = this.verify_role.bind(this);
        this.identify = this.identify.bind(this);
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

    // Optional auth: accepts a logged-in user's JWT, or — for anonymous/guest
    // checkout — a client-generated X-Guest-Id header identifying their cart.
    // Rejects only if neither identity is present.
    identify = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(" ")[1];
            return jwt.verify(token, this.secret, (err, decoded) => {
                if (!err) {
                    req.user = decoded;
                    return next();
                }
                return this._identifyGuest(req, res, next);
            });
        }

        return this._identifyGuest(req, res, next);
    }

    _identifyGuest = (req, res, next) => {
        const guestId = req.headers['x-guest-id'];
        if (!guestId || typeof guestId !== 'string' || !/^[a-zA-Z0-9-]{8,100}$/.test(guestId)) {
            return ApiResponse.error(res, "Guest session required", 400);
        }
        req.user = { id: null, guest_id: guestId, user_role: 'guest' };
        next();
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
