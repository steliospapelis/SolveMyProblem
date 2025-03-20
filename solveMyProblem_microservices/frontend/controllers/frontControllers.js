const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//Frontend Controllers for Users Service Requests
//-----------------------------------------------------------//


// Frontend function that will send a signup request to Users Service.

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received username:', username);
        console.log('Received password:', password);

        // Send signup request to the User Service
        const response = await axios.post(`${process.env.USERS_SERVICE_URL}/signup`, { username, password });

        // Retrieve the token from the response
        const token = response.data.token;

        // Store the token in the session
        req.session.jwtToken = token;

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Return token as response
        res.status(200).json({
            token: token
        });
    } catch (error) {
        if (error.response && error.response.status === 400) {
            res.status(400).json({ error: 'Invalid signup request. Please check your input.' });
        } else if (error.response && error.response.status === 409) {
            res.status(409).json({ error: 'Username already exists.' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};


// Frontend function that will send a login request to Users Service.

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received username:', username);
        console.log('Received password:', password);

        // Send login request to the User Service
        const response = await axios.post(`${process.env.USERS_SERVICE_URL}/login`, { username, password });

        // Retrieve the token from the response
        const token = response.data.token;
        console.log('Received token:', token);

        // Store the token in the session
        req.session.jwtToken = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Extract userId from JWT token
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.userId;
        console.log('Decoded userId:', userId);

        // Return token
        res.status(200).json({
            token: token
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            res.status(401).json({ error: 'Incorrect username or password.' });
        } else if (error.response && error.response.status === 400) {
            res.status(400).json({ error: 'Please check your login credentials. Username and Password are required.' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};


//Frontend function that terminates session.

exports.logout = (req, res) => {
    delete axios.defaults.headers.common['Authorization'];

    //Destroy the session and redirect to index page
    req.session.destroy(err => {
        res.redirect('/');
    });
};

//Frontend function that updates the amount of credits of logged in user by requesting an update on the Users Service.

exports.updateCredits = async (req, res) => {
    try {
        const { creditsToAdd } = req.body;
        console.log('Received creditsToAdd:', creditsToAdd);

        const token = req.headers.authorization.split(' ')[1];
        console.log('Sending token:', token);

        //Calls the corresponding route of Users Service
        const response = await axios.post(`${process.env.USERS_SERVICE_URL}/updateCredits`, { creditsToAdd: creditsToAdd }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Credits updated successfully:', response.data);
        res.status(200).json({ message: 'Credits updated successfully' });
    } catch (error) {
        if (error.response && error.response.status === 400) {
            res.status(400).json({ error: 'Invalid request. Please check the credits value.' });
        } else if (error.response && error.response.status === 401) {
            res.status(401).json({ error: 'Unauthorized. Please log in to update credits.' });
        } else if (error.response && error.response.status === 404) {
            res.status(204).json({ error: 'User not found.' });
        } else {
            console.error('Error adding credits:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};


//Frontend function that requests the number of credits of logged in user from the User Service.

exports.fetchCredits = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log('Sending token:', token);

        //Calls the corresponding route of Users Service
        const response = await axios.get(`${process.env.USERS_SERVICE_URL}/fetchCredits`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.status(200).json({ message: 'Credits fetched successfully', credits: response.data.credits, role: response.data.role});
    } catch (error) {
        if (error.response && error.response.status === 401) {
            res.status(401).json({ error: 'Unauthorized. Please login to see the number of credits.' });
        } else if (error.response && error.response.status === 404) {
            res.status(204).json({ error: 'User not found in database.' });
        } else {
            console.error('Error retrieving credits:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};


//Frontend Controllers for Problems Service Requests
//-----------------------------------------------------------//

//Frontend function that requests the submitted problems of logged in user (or all problems if logged in user is an admin).
exports.problems = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        //Calls the corresponding route of Problems Service
        const response = await axios.get(`${process.env.PROBLEM_SERVICE_URL}/problems`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        console.log('Retrieved Problems successfully:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving problems:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Failed to retrieve problems');
        }
    }
};

//Frontend function that requests the problem models from the Problems Service

exports.models = async (req, res) => {
    try {
        //Calls the corresponding route of Problem Service
        const response = await axios.get(`${process.env.PROBLEM_SERVICE_URL}/models`, {

        });


        console.log('Retrieved Models successfully:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving models:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Failed to retrieve models');
        }
    }
};

//Frontend function that requests the parameters of a specific model from the Problem Service

exports.parameters = async (req, res) => {
    try {
        const modelId = req.params.modelId;


        //Calls the corresponding route of Problems Service
        const response = await axios.get(`${process.env.PROBLEM_SERVICE_URL}/parameters/${modelId}`, {
        });


        console.log('Retrieved Parameters successfully:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving parameters:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Failed to retrieve parameters');
        }
    }
};

//Frontend function that requests the deletion of a specific problem from the Problem Service

exports.deleteProblem = async (req, res) => {
    try {
        const { problemId } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        if (!problemId) {
            return res.status(400).send('Problem ID is required');
        }

        const response = await axios.delete(`${process.env.PROBLEM_SERVICE_URL}/deleteProblem`, {
            data: { problemId: problemId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Deleted Problem successfully:', response.data);
        res.status(200).send('Problem deleted successfully');
    } catch (error) {
        console.error('Error deleting problem:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Failed to delete problem');
        }
    }
};

//Frontend function that requests the insertion of a new problem in the Problem Service's database

exports.newProblem = async (req, res) => {
    try {
        const { problemName, parameters } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        const problemData = {
            problemName: problemName,
            problemTypeId: req.body.problemTypeId,
            parameters: parameters
        };

        const response = await axios.post(`${process.env.PROBLEM_SERVICE_URL}/newProblem`, problemData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        console.log('Problem submitted successfully:', response.data);
        res.status(201).redirect('/home');  // Redirect to success page or handle success response
    } catch (error) {
        console.error('Error submitting new problem:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Failed to submit problem');
        }
    }
};

//Frontend function that requests info of a specific problem from the Problem Service

exports.infoProblem = async (req, res) => {
    try {
        const { problemId } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        if (!problemId) {
            return res.status(400).send('Problem ID is required');
        }

        const response = await axios.post(`${process.env.PROBLEM_SERVICE_URL}/infoProblem`, {
            problemId: problemId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });


        console.log('Problem info fetched successfully:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching problem info:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Failed to fetch problem info');
        }
    }
};

//Frontend function that requests the update of a specific problem's info on the Problem Service's database

exports.updateProblem = async (req, res) => {
    try {
        const { problemId, problemName, values } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        if (!problemId || !problemName || !values) {
            return res.status(400).send('Problem ID, name, and values are required');
        }

        await axios.post(`${process.env.PROBLEM_SERVICE_URL}/updateProblem`, {
            problemId: problemId,
            problemName: problemName,
            values: values
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).send('Problem updated successfully');
    } catch (error) {
        console.error('Error updating problem:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Failed to update problem');
        }
    }
};


//Frontend Controllers for Solver Service Requests
//-----------------------------------------------------------//

//Frontend function that requests the execution of a specific problem in the Solver Service

exports.runSolver = async (req, res) => {
    try {
        const { problemId } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        console.log('Sending token:', token); // Debug statement

        const response = await axios.post(`${process.env.SOLVER_SERVICE_URL}/runSolver`, { problemId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Solver ran successfully:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error running solver:', error);

        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to run solver' });
        }
    }
};

//Frontend function that requests the solution of a specific problem from the Solver Service's database

exports.fetchSolution = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log('Sending token:', token); // Debug statement
        const { problemId } = req.body;

        const response = await axios.post(`${process.env.SOLVER_SERVICE_URL}/fetchSolution`, { problemId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Solution fetched successfully:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching solution:', error);

        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to fetch solution' }); // 500 for internal server error
        }
    }
};

//Frontend function that requests statistical info related to problems and their solutions from the problem and
//solver services. This is an admin-only operation that requires authorization.

exports.fetchStats = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const filter = req.query.filter || 'lifetime';

        // Fetching problem statistics with time range filter
        const problemStatsResponse = await axios.get(`${process.env.PROBLEM_SERVICE_URL}/statsProblem?filter=${filter}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const problemStats = problemStatsResponse.data;

        // Fetching solution statistics with time range filter
        const solutionStatsResponse = await axios.get(`${process.env.SOLVER_SERVICE_URL}/statsSolution?filter=${filter}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const solutionStats = solutionStatsResponse.data;

        // Combine all statistics into a single object
        const response = {
            totalProblemsUploaded: problemStats.totalProblemsUploaded,
            problemsPerModel: problemStats.problemsPerModel,
            totalExecutions: solutionStats.numberOfExecutions,
            totalTimeExecuted: solutionStats.totalExecutionsTime
        };

        console.log('Fetched Stats:', response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching statistics:', error);

        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to retrieve statistics' });
        }
    }
};

