const mongoose = require('mongoose');
const slugify = require('slugify');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true, // remove all white space in the beginning and end of string
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], //An Array of Strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // Hides 'createdAt'
    },
    startDates: [Date], //An Array of Dates
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // To Show the virtual props
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // 'this' is the schema (current document) also we use regular function cause we need 'this'
});

// Document Middleware (or Hook)
toursSchema.pre('save', function (next) {
  // will be called before a document gets saved using .save() and .create() only
  this.slug = slugify(this.name, { lower: true });
  next();
});

// toursSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware
// toursSchema.pre('find', function (next) {
toursSchema.pre(/^find/, function (next) {
  // All the commands that start with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (docs, next) {
  // 'this' is for the query
  console.log(`Query took ${Date.now() - this.start} ms`);
  console.log(docs);
  next();
});

// Aggregation Middleware
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', toursSchema); // Uppercase for model name

module.exports = Tour;
