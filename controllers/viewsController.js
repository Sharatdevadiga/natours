const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.aler =
      'Your booking was successful. check your My bookings section (in your profile) for confirmation. If your booking does not show up here immediately, please come back later.';
  }

  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. get tour data from the collection
  const tours = await Tour.find();

  // 2. build template in pug file

  // 3. render that template using tour data from step 1
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  // 2. build the template

  // 3. render template using data from step
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTour = catchAsync(async (req, res, next) => {
  //1. find all bookings,
  const bookings = await Booking.find({ user: req.user.id });

  // 2. find tours with the returned IDs
  const tourIds = bookings.map(el => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  // 3. render tours
  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updateUserDate = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
};
