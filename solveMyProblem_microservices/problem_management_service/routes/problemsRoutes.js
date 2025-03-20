const express = require('express');
const router = express.Router();
const problemsController = require('../controllers/problemsController');

//Endpoint that fetches problems submitted by the logged in user or all submitted problems if logged in user is an admin.
router.get('/problems',problemsController.problems);

//Endpoint that deletes a specific problem
router.delete('/deleteProblem',problemsController.deleteProblem);

//Endpoint that fetches available problem models from the database (eg Vehicle Routing Problem)
router.get('/models', problemsController.models);

//Endpoint that fetches the parameters and their type of a specific problem model (eg number of vehicles, max distance)
router.get('/parameters/:modelId', problemsController.parameters);

//Endpoint for problem creation and insertion in database
router.post('/newProblem', problemsController.newProblem);

//Endpoint that fetches a submitted problem's info
router.post('/infoProblem', problemsController.infoProblem);

//Endpoint that updates a submitted problem's info
router.post('/updateProblem', problemsController.updateProblem);

//Endpoint that passes problem info to solver service so that it can be executed
router.get('/runProblem/:problemId', problemsController.runProblem);

//Endpoint that change's a problem's status
router.post('/statusProblem', problemsController.statusProblem);

//Endpoint that calculates problem related statistics like number of problems submitted today for admin analytics
router.get('/statsProblem', problemsController.statsProblem);


module.exports = router;
