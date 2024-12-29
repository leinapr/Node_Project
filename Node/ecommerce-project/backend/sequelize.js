const { Sequelize } = require('sequelize');

// Initialize Sequelize with database credentials
const sequelize = new Sequelize('ecommerce', 'postgres', '12082001sad', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false // Disable SQL query logging in the console
});

// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;
