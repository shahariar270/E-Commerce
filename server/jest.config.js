module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    // Cart/order stock logic mutates shared documents (and the coupon
    // used_count counter); running test files in parallel workers against
    // the same test database would let them race each other the same way
    // the app's own concurrency bugs do. One worker keeps runs deterministic.
    maxWorkers: 1,
    testTimeout: 15000,
};
