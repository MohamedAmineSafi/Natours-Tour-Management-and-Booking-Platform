const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // console.log(req.query); Gives access to url query like example.com/?key=value
    // req url: http://localhost:8000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // queryStr is { duration: { '$gte': '5' }, difficulty: 'easy' }
    let query = Tour.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // http://localhost:8000/api/v1/tours?sort=price,ratingsAverage
      // http://localhost:8000/api/v1/tours?sort=-price,ratingsAverage
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
      // query = query.select('name duration price');
    } else {
      query = query.select('-__v'); // removes __v
    }

    const page = req.query.page * 1 /*convert to number*/ || 1; // default value is 1
    const limit = req.query.limit * 1 || 100;
    const skip = limit * (page - 1);
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments();
      if (skip >= numberOfTours) throw new Error('This page does not exist');
    }

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours, //Key-Value are the same same (so you don't have to repeat it)
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    newTour = await Tour.create(req.body); //Returns a promise

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Data Sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  // This is a PATCH request which means that some (not all) of the object will be replaced. If this was a PUT request the same code will replace the entire object
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //The 'new: true' option in the findByIdAndUpdate() method tells Mongoose to return the updated document to you, rather than the original document.
      runValidators: true, //IMPORTANT
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Data Sent',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); //Don't forget 'await'
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Data Sent',
    });
  }
};
