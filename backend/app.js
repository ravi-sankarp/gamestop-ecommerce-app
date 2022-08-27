import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { config } from 'dotenv';
import colors from 'colors';

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
  res.status(res.statusCode || err.status || 500);
  console.error(colors.red(`\n \n URL:${req.url}\n Message:${err.message}`) +colors.yellow(`\n Stack:${err.stack} \n \n`));
  res.json({
    message: err.message,
    details: {
      stack: req.app.get('env') === 'development' ? err.stack : {}
    }
  });
});

export default app;
