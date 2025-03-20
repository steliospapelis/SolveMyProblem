const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../utils/jwtkey'); // Import the JWT secret key
const users = require ('../models/users');
const sequelize = require("../utils/db");
const {DataTypes} = require("sequelize");
const User = users(sequelize,DataTypes);


//signup function for new users. Requires Username and Password. If successful creates token/session.

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const usercreate = await User.create({ username, password: hashedPassword });
        const user = await User.findOne({ where: { username } });

        const token = jwt.sign({ userId: user.userId, username: user.username, role: user.role }, jwtSecretKey, { expiresIn: '1h' });


        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error('Error in signup:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Username already exists' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

//Login Function for existing users.Requires username and password. If successful creates token/session.

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.userId, username: user.username, role: user.role }, jwtSecretKey, { expiresIn: '1h' });


        res.status(200).json({ token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//Function for users to buy credits.(Dummy implementation with no real transaction).Requires authorization header.

exports.updateCredits = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const userId = decodedToken.userId;

        const { creditsToAdd } = req.body;

        if (!creditsToAdd || isNaN(creditsToAdd)) {
            return res.status(400).json({ error: 'Invalid credits value' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(204).json({ error: 'User not found' });
        }

        user.credits += parseInt(creditsToAdd);
        await user.save();


        res.status(200).json({ message: 'Credits updated successfully', credits: user.credits });
    } catch (error) {
        console.error('Error updating credits:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Login Required.' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

//Function to find how many credits a user has . Requires authorization header.

exports.fetchCredits = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const userId = decodedToken.userId;

        const user = await User.findOne({
            where: { userId: userId },
            attributes: ['credits']
        });

        if (!user) {
            return res.status(204).json({ error: 'User not found' });
        }

        const role = decodedToken.role;
        res.status(200).json({ credits: role === 1 ? 9999 : user.credits, role: role });
    } catch (error) {
        console.error('Failed to fetch credits:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Login Required.' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};



