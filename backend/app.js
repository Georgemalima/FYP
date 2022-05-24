const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const errorMiddleware = require('../backend/middlewares/errors');

app.use(express.json());
app.use(cookieParser());

//import all routes
const houses = require('./routes/house');
const auth = require('./routes/auth');


app.use('/api/v1', houses);
app.use('/api/v1', auth);

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;