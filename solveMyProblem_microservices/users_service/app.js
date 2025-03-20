const express = require('express');
const userRoutes = require('./routes/userRoutes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('./utils/jwtkey');
const users = require ('./models/users');

const sequelize = require('./utils/db');
const {DataTypes} = require("sequelize");
const User = users(sequelize,DataTypes);
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
app.use(userRoutes);

//The first time the application is deployed, create an admin user (username : admin   password : 1234)
const createAdminIfNotExists = async () => {
    try {
        const admin = await User.findOne({ where: { role: 1 } });

        if (!admin) {

            const hashedPassword = bcrypt.hashSync('1234', 10);


            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 1,
                credits: 0,
            });

            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error checking or creating admin user:', error);
    }
};

//Users microservice server

sequelize.sync().then((req) => {
    createAdminIfNotExists();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
