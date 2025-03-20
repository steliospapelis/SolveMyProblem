const express = require('express');
const router = express.Router();
const frontController = require('../controllers/frontControllers');

//Frontend acts as an API Gateway. The user has access to this API through the frontend and these
//endpoints call the routes of the other microservices.

// Routes for user-related operations
router.post('/signup', frontController.signup);
router.post('/login', frontController.login);
router.post('/logout', frontController.logout);
router.post('/updateCredits', frontController.updateCredits);
router.get('/fetchCredits', frontController.fetchCredits);

// Routes for problem-related operations
router.get('/problems', frontController.problems);
router.get('/models', frontController.models);
router.get('/parameters/:modelId', frontController.parameters);
router.delete('/deleteProblem', frontController.deleteProblem);
router.post('/newProblem', frontController.newProblem);
router.post('/infoProblem', frontController.infoProblem);
router.post('/updateProblem', frontController.updateProblem);


//Routes for solver-related operations
router.post('/runSolver/:problemId', frontController.runSolver);
router.post('/fetchSolution', frontController.fetchSolution);
router.get('/fetchStats', frontController.fetchStats);



module.exports = router;
