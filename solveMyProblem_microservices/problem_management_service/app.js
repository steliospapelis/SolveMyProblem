const express = require('express');
const problemsRoutes = require('./routes/problemsRoutes');
const bodyParser = require('body-parser');

const cors = require('cors'); // Import the CORS middleware
const app = express();
const PORT = 4002;

app.use(bodyParser.json({limit:'200mb'}));
app.use(bodyParser.urlencoded({ limit:'200mb',extended: true }));

const sequelize = require("./utils/db");
const {DataTypes} = require("sequelize");
const db = require ('./models/problems')(sequelize,DataTypes);
const Problem = db.Problems;
const Model = db.Models;
const Parameter = db.Parameters;
const Value = db.Values;
const fs = require('fs');
const path = require('path');
const { Op, fn, col } = require('sequelize');


//The first time the app is deployed, insert models and parameters in the database.

async function insertDefaultData() {
    try {
        await Model.findOrCreate({
            where: { modelId: 1 },
            defaults: {
                modelName: 'Vehicle Routing Problem',
                description: 'Optimizes the routes of a fleet of vehicles to reduce total travel distance and time.',
                scriptPath: './scripts/vrpSolver.py'
            }
        });

        await Model.findOrCreate({
            where: { modelId: 2 },
            defaults: {
                modelName: 'Linear Optimization',
                description: 'Linear optimization, also known as linear programming, aims to achieve the best outcome (such as maximum profit or lowest cost).',
                scriptPath: './scripts/LinOpt.py'
            }
        });

        await Model.findOrCreate({
            where: { modelId: 3 },
            defaults: {
                modelName: 'Travelling Salesperson Problem (Distance Matrix)',
                description: 'The Traveling Salesperson Problem (TSP) is a classic problem in optimization where the task is to find the shortest possible route.',
                scriptPath: './scripts/TSP.py'
            }
        });

        console.log('Default data inserted or already exists.');
    } catch (error) {
        console.error('Error inserting default data:', error);
    }
}

async function insertParametersData() {
    try {
        const parametersData = [
            {
                parameterId: 1,
                parameterName: 'Locations(JSON)',
                parameterType: 'file',
                isRequired: true,
                modelId: 1
            },
            {
                parameterId: 2,
                parameterName: 'Number of Vehicles',
                parameterType: 'number',
                isRequired: true,
                modelId: 1
            },
            {
                parameterId: 3,
                parameterName: 'Depot Index',
                parameterType: 'number',
                isRequired: true,
                modelId: 1
            },
            {
                parameterId: 4,
                parameterName: 'Max Distance (Meters)',
                parameterType: 'number',
                isRequired: true,
                modelId: 1
            },
            {
                parameterId: 5,
                parameterName: 'Constraints',
                parameterType: 'file',
                isRequired: true,
                modelId: 2
            },
            {
                parameterId: 6,
                parameterName: 'Objective Function',
                parameterType: 'text',
                isRequired: true,
                modelId: 2
            },
            {
                parameterId: 7,
                parameterName: 'Distances(Matrix)',
                parameterType: 'file',
                isRequired: true,
                modelId: 3
            },
            {
                parameterId: 8,
                parameterName: 'Depot Index',
                parameterType: 'number',
                isRequired: true,
                modelId: 3
            }
        ];

        for (const param of parametersData) {
            await Parameter.findOrCreate({
                where: { parameterId: param.parameterId },
                defaults: param
            });
        }

        console.log('Parameters data inserted or already exists.');
    } catch (error) {
        console.error('Error inserting parameters data:', error);
    }
}

app.use(express.json());
app.use(cors());
app.use(problemsRoutes);

//Problems microservice server

sequelize.sync().then(async () => {
    await insertDefaultData();
    await insertParametersData();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
