const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); // Middleware (to get data from post request) (req.body)

app.use((req, res, next) => {
  console.log('Hello Hello');
  next(); // DON'T FORGET
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Top Level Code (Run once ONLY) (can have blocking code)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Event Loop
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours, //Key-Value are the same same (so you don't have to repeat it)
    },
  });
};

const getTour = (req, res) => {
  // If we use :id? it becomes an optional parameter
  const id = req.params.id * 1; // Convert string to number ????? (trick)
  if (id > tours.length) {
    return res.status(404).json({
      //we user return to exit the function
      status: 'fail',
      message: 'invalid Id',
    });
  }
  const tour = tours.find((el) => el.id === id); // Returns an array where el.id === id

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // Don't forget the '/' before 'api'
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // Merge the two objects together
  tours.push(newTour); // Add newTour to the end of the tours array
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      //we user return to exit the function
      status: 'fail',
      message: 'invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      //we user return to exit the function
      status: 'fail',
      message: 'invalid Id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 8000;
app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});
