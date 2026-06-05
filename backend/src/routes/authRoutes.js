const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

//user registration
router.post(
    '/register',
    authController.registerUser
);

//user login
router.post(
    '/login',
    authController.loginUser
);

module.exports = router;