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
const Cart = require('./model/cart');
const http = require('http');
const socketManager = require('./socket');

const server = http.createServer(app);

socketManager.init(server);

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
    allowedHeaders: ["Content-Type", "Authorization", "X-Guest-Id"],
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
    .then(async () => {
        console.log('Database connected successfully');
        // Cart.user_id predates guest carts and was originally a plain unique
        // index (no sparse). Schema changes don't retroactively alter an
        // already-existing index, so without this, a live DB still enforces
        // "at most one cart may ever be missing user_id" — breaking every
        // guest cart after the first. syncIndexes reconciles the real DB
        // indexes with the current schema (rebuilding this one as sparse).
        await Cart.syncIndexes().catch((err) => {
            console.error('Cart.syncIndexes failed:', err);
        });
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
