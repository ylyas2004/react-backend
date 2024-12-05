require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Import the database connection and models
var db = require('./app_api/models/db');

// Import routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

app.use(cors());

// Middleware
app.use(logger('dev'));  // Logs HTTP requests
app.use(express.json());  // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false }));  // Parses URL-encoded requests
app.use(cookieParser());  // Parses cookies
app.use(express.static(path.join(__dirname, 'public')));  // Serves static files from 'public' directory

// Define routes
app.use('/', indexRouter);  // Root route
app.use('/users', usersRouter);  // Users route
app.use('/api', apiRouter);  // API route for the models

module.exports = app;
