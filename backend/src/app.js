import express from 'express';
import http from 'http';

const app = express();
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morganLogger from './config/morgan.logger.js';

const httpServer = http.createServer(app);

// middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookies
app.use(helmet()); // for setting various HTTP headers for security
app.use(morganLogger); // for logging HTTP requests

// routes
import authRoute from './routes/auth.route.js';

app.use('/api/v1/auth', authRoute);

// main route

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Authentication API',
  });
});

// error handling middleware
import errorMiddleware from './middlewares/error.middleware.js';

app.use(errorMiddleware);

export default httpServer;
