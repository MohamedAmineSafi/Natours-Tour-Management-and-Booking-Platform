const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.checkBody = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;

  if (!name || !price) {
    return res.status(400).json({
      status: 'failed',
      message: 'No Name or Price',
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours, //Key-Value are the same same (so you don't have to repeat it)
    // },
  });
};

exports.getTour = (req, res) => {
  // If we use :id? it becomes an optional parameter
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id); // Returns an array where el.id === id

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
