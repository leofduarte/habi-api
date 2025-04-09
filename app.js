const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const loggerMiddleware = require('./middleware/logger.middleware.js');
const errorHandler = require('./middleware/error.middleware.js');

const usersRouter = require('./routes/user.routes.js');
const authRouter = require('./routes/auth.routes.js');
const questionsRouter = require('./routes/question.routes.js');
const prizesRouter = require('./routes/prize.routes.js');
const missionsRouter = require('./routes/mission.routes.js');
const goalsRouter = require('./routes/goal.routes.js');
const specialMissionsRouter = require('./routes/specialMission.routes.js');
const dailyQuoteRouter = require('./routes/dailyQuote.routes.js'); //? por implementar
// const answersRouter = require('./routes/answer.routes.js'); //? por implementar

const app = express();

app.use(logger("dev"));
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/questions', questionsRouter);
app.use('/api/v1/prizes', prizesRouter);
app.use('/api/v1/missions', missionsRouter);
app.use('/api/v1/goals', goalsRouter);
app.use('/api/v1/special-missions', specialMissionsRouter);
app.use('/api/v1/daily-quotes', dailyQuoteRouter);



app.use(errorHandler);

module.exports = app;

