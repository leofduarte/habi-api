var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var psql = require('./database/psql');
var loggerMiddleware = require('./middleware/logger.middleware.js');

var indexRouter = require('./routes/index.routes.js');
var usersRouter = require('./routes/users.routes.js');
var authRouter = require('./routes/auth.routes.js');
var questionsRouter = require('./routes/questions.routes.js');
var prizesRouter = require('./routes/prizes.routes.js');
var missionsRouter = require('./routes/missions.routes.js'); // Add this line

var app = express();
psql ? console.log('APP - Postgres client is ready') : console.log('APP - Error initializing Postgres client');

app.use(logger('dev'));
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });
  
app.use('/api/v1/', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/questions', questionsRouter);
app.use('/api/v1/prizes', prizesRouter);
app.use('/api/v1/missions', missionsRouter); // Add this line


module.exports = app;

