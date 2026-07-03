import express from 'express';
import http from 'http';

const app = express();
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morganLogger from './config/morgan.logger.js';
import cors from 'cors';
import passport from './config/passport.js';

const httpServer = http.createServer(app);
import { initSocket } from './socket/index.js';

// middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookies
app.use(helmet()); // for setting various HTTP headers for security
app.use(morganLogger); // for logging HTTP requests
app.use(cors(corsOptions)); // use cors for cross-origin resource sharing
app.use(passport.initialize()); // initialize passport for authentication
app.set('trust proxy', true);

// connect to socket
initSocket(httpServer);

// routes
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);

// main route

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Authentication API',
  });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
  });
});

// error handling middleware
import errorMiddleware from './middlewares/error.middleware.js';
import corsOptions from './config/cors.js';

app.use(errorMiddleware);

export default httpServer;
