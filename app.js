const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');

//$ middleware
const loggerMiddleware = require('./middlewares/logger.middleware.js');
const errorHandler = require('./middlewares/error.middleware.js');

//$ routes
const authRouter = require('./routes/auth.routes.js');
const dailyQuoteRouter = require('./routes/dailyQuote.routes.js');
const goalsRouter = require('./routes/goal.routes.js');
const missionsRouter = require('./routes/mission.routes.js');
// const openAiRouter = require('./routes/openAi.routes.js'); //! por implementar
const prizesRouter = require('./routes/prize.routes.js');
const questionsRouter = require('./routes/question.routes.js');
const specialMissionsRouter = require('./routes/specialMission.routes.js');
const statsRouter = require('./routes/stats.routes.js');
const usersRouter = require('./routes/user.routes.js');

const app = express();

app.use(logger("dev"));
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/daily-quotes', dailyQuoteRouter);
app.use('/api/v1/goals', goalsRouter);
app.use('/api/v1/missions', missionsRouter);
// app.use('/api/v1/open-ai', openAiRouter); //! por implementar
app.use('/api/v1/prizes', prizesRouter);
app.use('/api/v1/questions', questionsRouter);
app.use('/api/v1/special-missions', specialMissionsRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/users', usersRouter);

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;

