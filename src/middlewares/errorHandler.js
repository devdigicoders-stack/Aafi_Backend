const errorHandler = (err, req, res, next) => {
  // Use status code set by controller or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`Error: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
