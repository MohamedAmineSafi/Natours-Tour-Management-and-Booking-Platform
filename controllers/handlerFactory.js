const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id); //Don't forget 'await'

    if (!doc) {
      // use return to stop the code
      return next(new AppError('No document Found with that Id', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //The 'new: true' option in the findByIdAndUpdate() method tells Mongoose to return the updated document to you, rather than the original document.
      runValidators: true, //IMPORTANT
    });

    if (!doc) {
      // use return to stop the code
      return next(new AppError('No document Found with that Id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    doc = await Model.create(req.body); //Returns a promise
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
