const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../utils/jwtkey');
const sequelize = require("../utils/db");
const {DataTypes} = require("sequelize");
const db = require ('../models/problems')(sequelize,DataTypes);
const Problem = db.Problems;
const Model = db.Models;
const Parameter = db.Parameters;
const Value = db.Values;
const fs = require('fs');
const path = require('path');
const { Op, fn, col } = require('sequelize');


//Function to return problems submitted from database.

exports.problems = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const username = decodedToken.username;
        const role = decodedToken.role;

        let problemInfo;
        if (role === 1) {
            problemInfo = await Problem.findAll({
                attributes: ['problemId', 'problemName', 'username', 'status', 'createdAt']
            });
        } else {
            problemInfo = await Problem.findAll({
                where: { username },
                attributes: ['problemId', 'problemName', 'username', 'status', 'createdAt']
            });
        }

        if (problemInfo.length === 0) {
            return res.status(204).json();
        }

        res.status(200).json(problemInfo);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Login Required.' });
        }
        res.status(500).send('Internal Server Error');
    }
};


//Function to return available problem models in the database (types of problems eg vehicle routing)
exports.models = async (req, res) => {
    try {
        const models = await Model.findAll({
            attributes: ['modelName', 'description', 'modelId']
        });

        if (models.length === 0) {
            return res.status(204).json();
        }

        res.status(200).json(models);
    } catch (error) {
        res.status(500).send('Failed to retrieve models');
    }
};

//Function to return what parameters each model requires and their type.
//(Eg vehicle routing requires locations (json file) , depot index (int) , number of vehicles (int) and max distance (int))
exports.parameters = async (req, res) => {
    try {
        const parameters = await Parameter.findAll({
            where: { modelId: req.params.modelId }
        });

        if (parameters.length === 0) {
            return res.status(204).json();
        }

        res.status(200).json(parameters);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

//Function to delete a problem from the database.

exports.deleteProblem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const username = decodedToken.username;

        const { problemId } = req.body;

        // Admins can delete any problem, while regular users can only delete their own problems
        const condition = decodedToken.role === 1 ? { problemId } : { problemId, username };

        // Verify that the problem exists and the user has permission to delete it
        const problem = await Problem.findOne({ where: condition });

        if (!problem) {
            return res.status(204).send('Problem not found or you do not have permission to delete it.');
        }

        await Value.destroy({
            where: { problemId }
        });

        await Problem.destroy({
            where: { problemId }
        });

        res.status(200).send('Problem deleted successfully.');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

//Function to create a new problem and insert it in the database.

exports.newProblem = async (req, res) => {
    const { problemName, problemTypeId, parameters } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const problem = await Problem.create({
            problemName,
            problemTypeId,
            status: 'Ready',
            username: decodedToken.username
        });

        const values = parameters.map(param => ({
            problemId: problem.problemId,
            parameterId: param.parameterId,
            value: param.value
        }));

        await Value.bulkCreate(values);

        res.status(201).send({ message: 'Problem and parameters added successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Login Required.' });
        }
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


//Function to return information about a problem. (The values submitted for each parameter, name , username of the
//user who submitted it etc.)

exports.infoProblem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const username = decodedToken.username;

        const { problemId } = req.body;

        if (!problemId) {
            return res.status(400).send('Problem ID is required');
        }

        // Admins can access any problem, while regular users can only access their own problems
        const condition = decodedToken.role === 1 ? { problemId } : { problemId, username };

        // Verify that the problem exists and the user has permission to view it
        const problem = await Problem.findOne({
            where: condition,
            attributes: ['problemName', 'createdAt']
        });

        if (!problem) {
            return res.status(204).send('Problem not found or you do not have permission to view it.');
        }

        const values = await Value.findAll({
            where: { problemId },
            include: [{
                model: Parameter,
                attributes: ['parameterName', 'parameterType']
            }]
        });

        const problemInfo = {
            problemName: problem.problemName,
            createdAt: problem.createdAt,
            values: values.map(value => ({
                entryId: value.entryId,
                parameterName: value.Parameter.parameterName,
                parameterType: value.Parameter.parameterType,
                value: value.value
            }))
        };

        res.status(200).json(problemInfo);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

//Function to update a submitted problem's info like name and values of parameters
exports.updateProblem = async (req, res) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const username = decodedToken.username;
        const role = decodedToken.role;

        const { problemId, problemName, values } = req.body;

        // Admins can update any problem, while regular users can only update their own problems
        const condition = role === 1 ? { problemId } : { problemId, username };

        // Verify that the problem exists and the user has permission to update it
        const problem = await Problem.findOne({ where: condition });

        if (!problem) {
            return res.status(204).send('Problem not found or you do not have permission to update it.');
        }

        await problem.update({ problemName });
        problem.status = 'Ready';
        await problem.save();


        for (const { entryId, value } of values) {
            const entry = await Value.findByPk(entryId);
            if (entry) {
                await entry.update({ value });
            }
        }

        res.status(200).send('Problem and values updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to update problem and values');
    }
};


// Function to submit a problem for solving. Returns info to solver microservice so that the problem can be executed there.

exports.runProblem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const role = decodedToken.role;
        const { problemId } = req.params;

        // Admins and the owner of the problem can run it
        const condition = role === 1 ? { problemId } : { problemId, username: decodedToken.username };

        const problem = await Problem.findOne({
            where: condition,
            include: [{ model: Model, attributes: ['scriptPath'] }]
        });

        if (!problem) {
            return res.status(204).json({ error: 'Problem not found or you do not have permission to run it.' });
        }

        const parameterValues = await Value.findAll({
            where: { problemId },
            include: [{ model: Parameter, attributes: ['parameterId', 'parameterName', 'parameterType'] }],
            order: [['parameterId', 'ASC']]
        });

        const scriptPath = problem.Model.scriptPath;
        const argumentsArray = [];
        let jsonContent = '';

        for (let paramValue of parameterValues) {
            const { parameterType } = paramValue.Parameter;
            let value = paramValue.value;

            if (parameterType === 'file') {
                jsonContent = value;
            } else {
                argumentsArray.push(value);
            }
        }

        res.status(200).json({ scriptPath, jsonContent, arguments: argumentsArray });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function that updates the problem's status (Ready, Running..., Executed)
exports.statusProblem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const role = decodedToken.role;
        const { problemId, newStatus } = req.body;

        const validStatuses = ['Ready', 'Running...', 'Executed'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Admins and the owner of the problem can update its status
        const condition = role === 1 ? { problemId } : { problemId, username: decodedToken.username };

        const problem = await Problem.findOne({ where: condition });
        if (!problem) {
            return res.status(204).json({ error: 'Problem not found or you do not have permission to update its status.' });
        }

        problem.status = newStatus;
        await problem.save();

        res.status(200).json({ message: 'Problem status updated successfully', problem });
    } catch (error) {

        res.status(500).json({ error: 'Failed to update problem status' });
    }
};

// Function that returns statistical info of problems for admin analytics

exports.statsProblem = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecretKey);
        const role = decodedToken.role;

        if (role !== 1) {
            return res.status(401).json({ error: 'Unauthorized access. Admins only.' });
        }

        const { filter } = req.query;

        let dateRange = {};
        const now = new Date();

        switch (filter) {
            case 'today':
                dateRange = { createdAt: { [Op.between]: [new Date(now.setHours(0, 0, 0, 0)), new Date(now.setHours(23, 59, 59, 999))] } };
                break;
            case 'this-week':
                const startOfWeek = new Date();
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                dateRange = { createdAt: { [Op.between]: [startOfWeek, endOfWeek] } };
                break;
            case 'this-month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                dateRange = { createdAt: { [Op.between]: [startOfMonth, endOfMonth] } };
                break;
            case 'lifetime':
            default:
                dateRange = {};
                break;
        }

        const totalProblemsUploaded = await Problem.count({ where: dateRange });

        const problemsPerModel = await Problem.findAll({
            attributes: ['problemTypeId', [sequelize.fn('COUNT', 'problemTypeId'), 'count']],
            group: ['problemTypeId'],
            where: dateRange,
            include: [{
                model: Model,
                attributes: ['modelName']
            }]
        });

        const problemsPerModelFormatted = problemsPerModel.map(item => ({
            modelId: item.problemTypeId,
            modelName: item.Model.modelName,
            count: item.dataValues.count
        }));

        res.status(200).json({
            totalProblemsUploaded,
            problemsPerModel: problemsPerModelFormatted
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve problem statistics' });
    }
};
