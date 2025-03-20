const express = require('express');
const solverRoutes = require('./routes/solverRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4003;

app.use(bodyParser.json({limit:'200mb'}));
app.use(bodyParser.urlencoded({ limit:'200mb',extended: true }));
app.use(express.json());
const sequelize = require('./utils/db');
app.use(cors());
app.use(solverRoutes);

//Solver microservice server

sequelize.sync().then((req) => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
