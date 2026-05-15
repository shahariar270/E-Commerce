const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

dotenv.config({
    path: path.resolve(__dirname, '..', '..', envFile),
});

module.exports = {
    envFile,
};
