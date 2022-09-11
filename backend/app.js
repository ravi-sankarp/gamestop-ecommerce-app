import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
// eslint-disable-next-line no-unused-vars
import colors from 'colors';

//importing mongoconnect function
import db from './config/db.js';

//importing error handling middleware
import errorHandler from './middlewares/errorHandler.js';
import AppError from './utils/appError.js';

//importing routes
import indexRouter from './routes/index.js';
import adminRouter from './routes/admin.js';

//linking config file
config({ path: './config.env' });

const app = express();
app.enable('trust proxy');

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Implement CORS
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());


//connecting to database
db.initDb((err, _db) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`\n MongoDB Connection successful \n \n `.magenta);
  }
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(errorHandler);

export default app;
