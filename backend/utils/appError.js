// This class is used to create custom error messages for the application. It extends the Error class and has a constructor that takes in a message and a status code. The status code is used to determine if the error is a 4xx or 5xx error. If it is a 4xx error, the status is set to fail, otherwise it is set to error. The isOperational property is set to true so that we can check if the error is an operational error or a programming error. This is useful for handling errors in the global error handling middleware.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = AppError;
