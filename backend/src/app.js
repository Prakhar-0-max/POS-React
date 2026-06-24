const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// CORS configuration matching Spring Boot settings
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4200')
  .split(',')
  .map(o => o.trim());
console.log('CORS_ORIGINS environment variable:', process.env.CORS_ORIGINS);
console.log('Parsed allowedOrigins:', allowedOrigins);
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes prefix
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
