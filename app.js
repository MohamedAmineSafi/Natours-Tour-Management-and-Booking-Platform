const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); // Middleware (to get data from post request) (req.body)

app.use(express.static(`${__dirname}/public`)); // sets public as a root folder (localhost/overview.html)

app.use((req, res, next) => {
  console.log('Hello Hello');
  next(); // DON'T FORGET
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Top Level Code (Run once ONLY) (can have blocking code)
// Event Loop

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
