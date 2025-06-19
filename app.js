const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const loggerWinston = require('./utils/loggerWinston.utils')

//$ define environment variables that will be used based on the environment
require('dotenv-flow').config({
  node_env: process.env.NODE_ENV || 'development'
})

//$ swagger documentation
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger.js')

//$ Oauth
const passport = require('passport')
require('./config/googleAuth')

//$ middleware
const errorHandler = require('./middlewares/error.middleware.js')
const {
  authLimiter,
  generalLimiter
} = require('./middlewares/rateLimiter.middleware.js')

//$ routes
const authRouter = require('./routes/auth.routes.js')
const dailyQuoteRouter = require('./routes/dailyQuote.routes.js')
const goalsRouter = require('./routes/goal.routes.js')
const missionsRouter = require('./routes/mission.routes.js')
const goalSuggestionsRoutes = require('./routes/goalMissionsSuggestions.routes.js')
const openAiRouter = require('./routes/openAI.routes.js')
const prizesRouter = require('./routes/prize.routes.js')
const questionsRouter = require('./routes/question.routes.js')
const specialMissionsRouter = require('./routes/specialMission.routes.js')
const statsRouter = require('./routes/stats.routes.js')
const usersRouter = require('./routes/user.routes.js')
const healthRouter = require('./routes/health.routes.js')

const app = express()

// Trust proxy for rate limiter
app.set('trust proxy', 1);

app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache')
      }
    }
  })
)

app.use(passport.initialize())

console.log(
  'Running in:',
  process.env.NODE_ENV + ' + ' + process.env.FRONTEND_URL
)
console.log('Database URL:', process.env.DATABASE_URL)

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      'https://www.habi-app.pt',
      'https://www.habi-app.pt',
      'http://localhost:5174',
      'http://localhost:8080',
      'https://localhost:5174',
      'http://192.168.1.182:5174',
      'https://192.168.1.182:5174',
      'https://192.168.1.105:5174'
    ],
    //? falso se nao usarmos cookies
    credentials: false
  })
)

app.use(generalLimiter)

app.use('/api/v1/auth', authLimiter, authRouter)
app.use('/api/v1/daily-quotes', dailyQuoteRouter)
app.use('/api/v1/goals', goalsRouter)
app.use('/api/v1/missions', missionsRouter)
app.use('/api/v1/suggestions', goalSuggestionsRoutes)
app.use('/api/v1/open-ai', openAiRouter)
app.use('/api/v1/prizes', prizesRouter)
app.use('/api/v1/questions', questionsRouter)
app.use('/api/v1/special-missions', specialMissionsRouter)
app.use('/api/v1/stats', statsRouter)
app.use('/api/v1/users', usersRouter)

app.use('/api/v1/health', healthRouter)

app.use(
  morgan('combined', {
    stream: {
      write: (message) => loggerWinston.info(message.trim())
    }
  })
)

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler)

module.exports = app
