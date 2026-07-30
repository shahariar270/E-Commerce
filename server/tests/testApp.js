// A minimal Express app for supertest — mounts the real router (so tests
// exercise the actual controllers/middleware) without app.js's side effects
// (helmet, the /api/auth rate limiter that would throttle repeated test
// requests, cors, or connecting to Mongo / calling server.listen itself).
const express = require('express');
const mongoSanitize = require('../middlewares/sanitize');
const router = require('../router');

const buildTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(mongoSanitize({ replaceWith: '_' }));
    app.use(router);
    return app;
};

module.exports = buildTestApp;
