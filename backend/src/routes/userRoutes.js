const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const {
    protect,
    isAdmin
} = require('../middlewares/authMiddleware');

router.post(
    '/',
    protect,
    isAdmin,
    userController.createUserByAdmin
);

router.get(
    '/',
    protect,
    isAdmin,
    userController.getAllUsersByAdmin
);

router.get(
    '/:id',
    protect,
    isAdmin,
    userController.getUserByIdByAdmin
);

router.put(
    '/update-password',
    protect,
    userController.updateUserPassword
);

module.exports = router;