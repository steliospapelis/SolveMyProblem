//Database - Sequelize Connection
const Sequelize = require("sequelize")

const DB_CONFIG = require("./db_config.js");
const sequelize = new Sequelize(
    DB_CONFIG.DB,
    DB_CONFIG.USER,
    DB_CONFIG.PASSWORD,
    {
        host: DB_CONFIG.HOST,
        dialect: DB_CONFIG.dialect
    }
);

sequelize
    .query(`CREATE SCHEMA IF NOT EXISTS ${DB_CONFIG.DB};`);

sequelize
    .authenticate()
    .then(() => {
        console.log('DATABASE CONNECTED');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });




module.exports = sequelize;
