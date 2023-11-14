const express = require('express');
const router = express.Router();
const passport = require('passport');

const userRoutes = require('./userRoutes');
const studentRoutes = require('./studentRoute');
const homeController = require('../controllers/homeController');
const companyRoutes = require('./companyRoute');

// Home page route: Requires user authentication to access.
router.get('/', passport.checkAuthentication, homeController.homePage);

// User routes: Routes related to user authentication and account management.
router.use('/users', userRoutes);

// Student routes: Routes related to student data and operations.
router.use('/students', studentRoutes);

// Company routes: Routes related to company data and operations.
router.use('/company', companyRoutes);

module.exports = router;
