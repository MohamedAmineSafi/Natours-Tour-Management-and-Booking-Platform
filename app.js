const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); // Middleware (to get data from post request) (req.body)

// Top Level Code (Run once ONLY) (can have blocking code)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Event Loop
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours, //Key-Value are the same same (so you don't have to repeat it)
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

const port = 8000;
app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});
