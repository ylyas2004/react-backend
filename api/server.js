// api/server.js

const app = require('../app');
const serverless = require('serverless-http'); // Import serverless-http module

module.exports.handler = serverless(app); // Use serverless-http to make the app serverless
