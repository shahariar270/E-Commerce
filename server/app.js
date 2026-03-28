const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

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
    res.status(200).json({
        massage: 'data get successfully',
    })
})
