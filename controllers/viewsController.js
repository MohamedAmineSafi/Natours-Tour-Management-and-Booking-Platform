const Tour = require('./../models/tourModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  // 2) Build Template
  // 3) Render That Template using tour data from step 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug }).populate({
    // Find will return an array, use findOne
    path: 'reviews',
    fields: 'review rating user',
  });
  res.status(200).render('tour', {
    tour,
  });
});
