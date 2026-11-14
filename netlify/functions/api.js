// netlify/functions/api.js
// Wraps the Express app as a Netlify serverless function

const serverless = require("serverless-http");
const app = require("../../index");

// serverless-http converts the Express app to a function handler
// that Netlify can call for each HTTP request
module.exports.handler = serverless(app);

