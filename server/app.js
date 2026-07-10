require('./config/env');
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('./middlewares/sanitize');
const { default: mongoose } = require('mongoose');
const router = require('./router');
const ApiResponse = require('./utils/api_response');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
});

// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
].filter(Boolean);

app.use(helmet());

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    vary: 'Origin'
}));

app.use(express.json({ limit: '100kb' }));

app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.json({ limit: '10kb' }));


app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized key "${key}" in request from ${req.ip}`);
    }
}));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

app.use(router);

const port = process.env.PORT || 10000;

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Database connected successfully');
        server.listen(port, '0.0.0.0', () => {
            console.log('Server is running on', port);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
    });

app.get('/', (req, res) => {
    return ApiResponse.success(res, 'data get successfully');
})
