const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value} please try another value`;
  return new AppError(message, 400);
};

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid Token , Please login again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('your token has expired. please login again', 401);
};

// while development send most info
const sendErrorDev = (err, req, res) => {
  //A. API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }
  //B. Rendered website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });
};

// in production, send msg for the operational error
const sendErrorProd = (err, req, res) => {
  // A. api
  if (req.originalUrl.startsWith('/api')) {
    // OPERATIONAL, TRUSTED ERROR -> SEND MESSAGE TO CLIENT
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // PROGRAMMING OR OTHER UNKNOWN ERROR: DON'T LEAK ERROR DETAILS
    // 1. log error
    console.error('Error ❌ !!!', err);

    // 2. send generic error
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }

  //B. rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }

  // PROGRAMMING OR OTHER UNKNOWN ERROR: DON'T LEAK ERROR DETAILS
  // 1. log error
  console.error('Error ❌ !!!', err);
  // 2. send generic error
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    console.error(error, err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 1100) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  } else {
    sendErrorProd(err, req, res);
  }

  next();
};
