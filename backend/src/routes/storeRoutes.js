const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const {
    protect,
    isAdmin
} = require('../middlewares/authMiddleware');

router.post(
    '/',
    protect,
    isAdmin,
    storeController.createStoreByAdmin
);

router.get(
    '/dashboard-stats',
    protect,
    isAdmin,
    storeController.getDashboardStats
);

router.get(
    '/my-store',
    protect,
    storeController.getStoreOwnerDashboard
);

router.get(
    '/',
    protect,
    storeController.getAllStores
);

router.post(
    '/:storeId/ratings',
    protect,
    storeController.submitOrUpdateRating
);

module.exports = router;