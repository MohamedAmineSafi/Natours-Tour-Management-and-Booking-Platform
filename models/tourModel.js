const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 chars'],
      minLength: [10, 'A tour name must have more or equal than 10 chars'],
      // excludes spaces lol
      // validate: [validator.isAlpha, 'Must have letters only'], // don't call
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
      enum: {
        // Allowed Values
        values: ['easy', 'medium', 'difficult'],
        message: 'Value not accepted',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Minimum is 1'],
      max: [5, 'Maximum is 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Price ({VALUE}) Discount can't be bigger than price",
      },
    },
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
    startLocation: {
      // Geo JSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // Array of numbers
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
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

// Query Middleware
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
