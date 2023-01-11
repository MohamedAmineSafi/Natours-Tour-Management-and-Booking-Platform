class AppError extends Error {
  /*
    In this code snippet, the AppError class is a child class of the built-in Error class in JavaScript.
    The super(message) line is calling the constructor of the parent class and passing it the error message.
    This will create an error object with that message, in this case, it does the same what new Error(message) does.
    Then the class can add additional properties or methods to the error object, like statusCode or isOperational
    to add more meaning to that error.
  */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
