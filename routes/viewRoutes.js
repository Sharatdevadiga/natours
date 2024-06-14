const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.isLoggedIn);
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour', authController.isLoggedIn, viewController.getTour);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);

// router to handle the user account page
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserDate
);

module.exports = router;
