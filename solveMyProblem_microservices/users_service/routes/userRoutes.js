const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/signup', userController.signup);                       //signup endpoint
router.post('/login', userController.login);                        //login endpoint
router.post('/updateCredits', userController.updateCredits);             //endpoint to buy credits
router.get('/fetchCredits', userController.fetchCredits);         //endpoint that fetches a user's credits value

module.exports = router;
