const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../utils/jwtkey');
const sequelize = require("../utils/db");
const {DataTypes} = require("sequelize");
const axios = require('axios');
const Solutions = require ('../models/solutions');
const Solution = Solutions(sequelize,DataTypes);
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { startOfDay, startOfWeek, startOfMonth } = require('date-fns');
const { Op } = require('sequelize');




//Function that runs a problem after requesting status updates and its info from the problem service.

exports.runSolver = async (req, res) => {
    try {
        const { problemId } = req.body;
        const token = req.headers.authorization.split(' ')[1];

        //Update the problem's status
        await axios.post(`${process.env.PROBLEM_SERVICE_URL}/statusProblem`, {
            problemId: problemId,
            newStatus: 'Running...'
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }});

        // Fetch problem details from the problem management microservice
        const problemResponse = await axios.get(`${process.env.PROBLEM_SERVICE_URL}/runProblem/${problemId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }});

        const problemData = problemResponse.data;
        const scriptPath = problemData.scriptPath;
        const jsonContent = problemData.jsonContent;
        const args = problemData.arguments;

        const jsonFileName = `${problemId}jsonData.json`;
        const jsonFilePath = path.join(__dirname, jsonFileName);

        // Write JSON value to a file so that it can be used as an argument when running python script
        fs.writeFileSync(jsonFilePath, jsonContent);
        args.unshift(jsonFilePath);

        // Start timer
        const startTime = process.hrtime();

        // Execute the Python script with the provided arguments
        exec(`python ${scriptPath} ${args.join(' ')}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                await axios.post(`${process.env.PROBLEM_SERVICE_URL}/statusProblem`, {
                    problemId: problemId,
                    newStatus: 'Ready'
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }});
                return res.status(500).json({ error: 'Failed to execute script' });
            }
            if (stderr) {
                console.error(`Script error output: ${stderr}`);
                await axios.post(`${process.env.PROBLEM_SERVICE_URL}/statusProblem`, {
                    problemId: problemId,
                    newStatus: 'Ready'
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }});
                return res.status(500).json({ error: 'Script execution error' });
            }

            // Calculate execution time
            const endTime = process.hrtime(startTime);
            const executionTime = endTime[0] + endTime[1] / 1e9; // Convert to seconds

            //Update the problem's status
            await axios.post(`${process.env.PROBLEM_SERVICE_URL}/statusProblem`, {
                problemId: problemId,
                newStatus: 'Executed'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }});

            // Store the solution and execution time in the database
            try {
                const existingSolution = await Solution.findOne({ where: { problemId: problemId } });

                if (existingSolution) {
                    await Solution.update({
                        solution: stdout,
                        timeExecuted: executionTime
                    }, {
                        where: { problemId: problemId }
                    });
                } else {
                    await Solution.create({
                        problemId: problemId,
                        solution: stdout,
                        timeExecuted: executionTime
                    });
                }

                res.status(201).json({ message: 'Solution stored successfully' });
            } catch (dbError) {
                console.error(`Database error: ${dbError.message}`);
                res.status(500).json({ error: 'Failed to store solution in the database' });
            }


            // Clean up JSON files after execution
            const directoryPath = path.join(__dirname, './');
            const jsonFileToDelete = path.join(__dirname, `${problemId}jsonData.json`);
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    console.error(`Error reading directory: ${err.message}`);
                    return;
                }
                // Delete only the specific JSON file
                fs.unlink(jsonFileToDelete, err => {
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    }
                });
            });
        });
    } catch (error) {
        console.error(`Error running solver: ${error.message}`);
        res.status(500).json({ error: 'Failed to run solver' });
    }
};

//Function that retrieves a problem's solution from the database.

exports.fetchSolution = async (req, res) => {
    const { problemId } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    if (!problemId) {
        return res.status(400).json({ error: 'problemId is required' });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const solution = await Solution.findOne({
            where: { problemId: problemId },
            attributes: ['solution', 'timeExecuted']
        });

        if (!solution) {
            return res.status(204).json({ error: 'Solution not found' }); // 404 for not found
        }

        res.status(200).json({ solution: solution.solution, timeExecuted: solution.timeExecuted }); // 200 for success
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Login Required.' });
        }
        console.error(`Error retrieving solution: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve solution' });
    }
};

//Function that calculates and provides solution related statistics like average execution time.

exports.statsSolution = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const role = decodedToken.role;

        if (role !== 1) {
            return res.status(401).json({ error: 'Unauthorized access. Admins only.' });
        }
        const filter = req.query.filter || 'lifetime';

        let whereClause = {};
        let startDate;
        let endDate;

        // Determine the date filter

        switch (filter) {
            case 'today':
                startDate = startOfDay(new Date());
                endDate = new Date(startDate).setHours(23, 59, 59, 999);
                whereClause = {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                };
                break;
            case 'this-week':
                startDate = startOfWeek(new Date());
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6); // End of the week
                endDate.setHours(23, 59, 59, 999);
                whereClause = {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                };
                break;
            case 'this-month':
                startDate = startOfMonth(new Date());
                endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1); // Start of next month
                endDate.setDate(endDate.getDate() - 1); // End of current month
                endDate.setHours(23, 59, 59, 999);
                whereClause = {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                };
                break;

        }

        // Fetch the statistics taking into account the selected time range filter
        const totalExecutionsTime = await Solution.sum('timeExecuted', { where: whereClause });
        const numberOfExecutions = await Solution.count({ where: whereClause });

        // Send the response with the statistics
        res.status(200).json({
            totalExecutionsTime: totalExecutionsTime || 0,
            numberOfExecutions: numberOfExecutions || 0
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Login Required.' });
        }
        console.error('Error fetching statistics:', error);
        res.status(500).send('Failed to retrieve statistics');
    }
};
