const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const User = require('../model/auth');

const ADMIN_ROOM = 'admins';

class SocketManager {
    constructor() {
        this.io = null;
    }

    init(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                methods: ["GET", "POST"]
            }
        });

        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth?.token;
                if (!token) {
                    return next(new Error('Authentication required'));
                }

                const decoded = jwt.verify(token, process.env.JWT_TOKEN);
                const account = await User.findById(decoded.id).select('is_active user_role');

                if (!account || account.is_active === false || account.user_role !== 'admin') {
                    return next(new Error('Admin access required'));
                }

                socket.user = decoded;
                next();
            } catch (err) {
                next(new Error('Authentication failed'));
            }
        });

        this.io.on('connection', (socket) => {
            socket.join(ADMIN_ROOM);

            socket.on('disconnect', () => {
                socket.leave(ADMIN_ROOM);
            });
        });

        return this.io;
    }

    emitToAdmins(event, payload) {
        if (!this.io) return;
        this.io.to(ADMIN_ROOM).emit(event, payload);
    }
}

module.exports = new SocketManager();
