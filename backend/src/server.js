require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || process.env.SERVER_PORT || 8080;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Synchronize models (behaves like Hibernate ddl-auto=update)
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start the server:', error);
    process.exit(1);
  }
};

startServer();
