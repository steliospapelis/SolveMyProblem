const express = require('express');
const bodyParser = require('body-parser');
const sessionSecretKey = require('./utils/sessionSecretKey');
const {DataTypes} = require("sequelize");

const userRoutes = require('./routes/frontRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const isAdminMiddleware = require('./middleware/isAdmin');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(bodyParser.json({limit:'200mb'}));
app.use(bodyParser.urlencoded({ limit:'200mb',extended: true }));
const sequelize = require('./utils/db');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessions = require("./models/sessions");
const Sessions=sessions(sequelize,DataTypes);


// Session middleware
app.use(session({
    secret: sessionSecretKey,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize, // Your Sequelize instance
        table: "Sessions",
    }),
}));

app.use((req, res, next) => {
    res.locals.token = req.session.jwtToken;
    next();
});


app.use('/', userRoutes);


// Define routes to render ejs files (views)
app.get('/', (req, res) => {
    res.render('index');
});


app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/credits', isAdminMiddleware, (req, res) => {
    res.render('credits');
});

app.get('/newproblem', authMiddleware, (req, res) => {
    res.render('newProblem');
});

app.get('/editProblem', (req, res) => {
    const problemId = req.query.problemId;
    res.render('editProblem', { problemId });
});

app.get('/solution', (req, res) => {
    const { problemId, problemName } = req.query;
    res.render('solution', { problemId, problemName });
});

app.get('/analytics', authMiddleware, (req, res) => {
    res.render('analytics');
});


// Frontend microservice Server

const PORT = 4001;
sequelize.sync().then((req) => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
