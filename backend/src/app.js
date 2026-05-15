import express from 'express';
import http from 'http';

const app = express();
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const httpServer = http.createServer(app);

// middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookiess
app.use(helmet()); // for setting various HTTP headers for security

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
