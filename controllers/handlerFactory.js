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
