const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || 'root';
const dbName = process.env.DB_NAME || 'pos_db';

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: false, // Spring Boot models did not have default timestamps like createdAt/updatedAt unless defined
    underscored: true,  // Match snake_case fields commonly used in databases
  },
});

module.exports = sequelize;
