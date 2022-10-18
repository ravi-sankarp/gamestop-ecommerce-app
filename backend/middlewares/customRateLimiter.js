import rateLimit from 'express-rate-limit';
import AppError from '../utils/appError.js';

// Limit requests from same API
const loginLimitter = rateLimit({
  max: 5,
  windowMs: 1000 * 60,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many request ! Please try to login after some time',
  handler: (req, res) => {
    throw new AppError('Too many request ! Please try to login after some time', 429);
  }
});
export default loginLimitter;
