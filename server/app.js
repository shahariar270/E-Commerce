require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const router = require('./router');
const ApiResponse = require('./utils/api_response');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(router);

const port = process.env.PORT || 10000;

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(port, '0.0.0.0', () => {
            console.log('Server is running on', port);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
    });

app.get('/', (req, res) => {
    return ApiResponse.success(res, 'data get successfully');
})
