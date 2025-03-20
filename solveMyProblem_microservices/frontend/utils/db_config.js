//Database configuration

module.exports = {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "root",
    PASSWORD: "",
    DB: process.env.DB_NAME || "solvefrontend",
    dialect: "mysql"
};
