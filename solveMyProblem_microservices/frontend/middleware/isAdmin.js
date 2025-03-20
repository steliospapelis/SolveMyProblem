//Middleware for admin authorization

const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../utils/jwtkey');

const isAdmin = (req, res, next) => {
    // Check if the user is authenticated and has a decoded JWT token
    if (!req.session.jwtToken) {
        return res.status(401).json({ error: 'Unauthorized: Missing JWT token' });
    }

    // Verify the JWT token
    jwt.verify(req.session.jwtToken, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid JWT token' });
        }


        req.user = decoded;

        // Check if the user's role is admin
        if (req.user.role !== 1) {
            return res.status(403).json({ error: 'Forbidden: User is not an admin' });
        }
        next();
    });
};

module.exports = isAdmin;
