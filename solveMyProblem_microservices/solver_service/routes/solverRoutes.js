const express = require('express');
const router = express.Router();
const solverController = require('../controllers/solverController');

//endpoint that runs a problem and stores solution in database
router.post('/runSolver', solverController.runSolver);
//endpoint that fetches the solution for a specific problem from the database
router.post('/fetchSolution', solverController.fetchSolution);
//endpoint that fetches solution related statistics for admin analytics
router.get('/statsSolution', solverController.statsSolution);




module.exports = router;
