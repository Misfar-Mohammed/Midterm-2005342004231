// netlify/functions/api.js — serverless wrapper for Netlify
const serverless = require("serverless-http");
const app = require("../../index");
module.exports.handler = serverless(app);
