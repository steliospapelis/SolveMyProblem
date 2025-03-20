//Middleware for user authorization

const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../utils/jwtkey');

const authenticateUser = (req, res, next) => {
    // Check if the JWT token exists in the session
    if (!req.session.jwtToken) {
        return res.status(401).json({ error: 'Unauthorized: Missing JWT token' });
    }

    // Verify the JWT token
    jwt.verify(req.session.jwtToken, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid JWT token' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = authenticateUser;
