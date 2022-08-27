import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { config } from 'dotenv';

//setting routes
import indexRouter from './routes/index.js';
import adminRouter from './routes/admin.js';

//linking config file
config({ path: './config.env' });

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // Sending error message
  res.status(err.status || 500);
  res.json({
    message: 'Something went wrong',
    details: {
      errorMessage: err.message,
      fullDetails: req.app.get('env') === 'development' ? err : {}
    }
  });
});

export default app;
