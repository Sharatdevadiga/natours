const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use(authController.isLoggedIn);
router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

router.get('/tour', authController.isLoggedIn, viewController.getTour);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTour);

// router to handle the user account page
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserDate
);

module.exports = router;
