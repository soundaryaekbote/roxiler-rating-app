const db = require('../config/db');

// Create New Store (Admin Only)
exports.createStoreByAdmin = async (req, res) => {

    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
        return res.status(400).json({
            message: 'Store name, email and address are required'
        });
    }

    if (address.length > 400) {
        return res.status(400).json({
            message: 'Address cannot exceed 400 characters'
        });
    }

    try {

        // Check if owner exists and has OWNER role
        if (owner_id) {

            const [ownerData] = await db.query(
                'SELECT role FROM users WHERE id = ?',
                [owner_id]
            );

            if (
                ownerData.length === 0 ||
                ownerData[0].role !== 'OWNER'
            ) {
                return res.status(400).json({
                    message: 'Invalid owner selected'
                });
            }
        }

        await db.query(
            `
            INSERT INTO stores
            (name, email, address, owner_id)
            VALUES (?, ?, ?, ?)
            `,
            [
                name,
                email,
                address,
                owner_id || null
            ]
        );

        res.status(201).json({
            message: 'Store created successfully'
        });

    } catch (error) {

        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Store email already exists'
            });
        }

        res.status(500).json({
            message: 'Server error while creating store'
        });
    }
};

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {

    try {

        const [userCount] = await db.query(
            'SELECT COUNT(*) AS totalUsers FROM users'
        );

        const [storeCount] = await db.query(
            'SELECT COUNT(*) AS totalStores FROM stores'
        );

        const [ratingCount] = await db.query(
            'SELECT COUNT(*) AS totalRatings FROM ratings'
        );

        res.json({
            totalUsers: userCount[0].totalUsers,
            totalStores: storeCount[0].totalStores,
            totalRatings: ratingCount[0].totalRatings
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Unable to fetch dashboard statistics'
        });
    }
};

// Get All Stores
exports.getAllStores = async (req, res) => {

    const {
        name,
        address,
        sortBy = 'name',
        order = 'ASC'
    } = req.query;

    const loggedInUserId = req.user.id;

    try {

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                AVG(r.rating) AS overallRating,

                (
                    SELECT rating
                    FROM ratings
                    WHERE user_id = ?
                    AND store_id = s.id
                ) AS userSubmittedRating

            FROM stores s
            LEFT JOIN ratings r
            ON s.id = r.store_id

            WHERE 1 = 1
        `;

        const values = [loggedInUserId];

        if (name) {
            query += ' AND s.name LIKE ?';
            values.push(`%${name}%`);
        }

        if (address) {
            query += ' AND s.address LIKE ?';
            values.push(`%${address}%`);
        }

        query += ' GROUP BY s.id';

        const allowedSortFields = [
            'name',
            'address'
        ];

        const finalSortField =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : 'name';

        const finalOrder =
            order.toUpperCase() === 'DESC'
                ? 'DESC'
                : 'ASC';

        query +=
            ` ORDER BY s.${finalSortField} ${finalOrder}`;

        const [stores] = await db.query(
            query,
            values
        );

        const formattedStores = stores.map(store => ({
            ...store,
            overallRating:
                store.overallRating
                    ? Number(store.overallRating).toFixed(2)
                    : 'N/A'
        }));

        res.json(formattedStores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Unable to fetch stores'
        });
    }
};

// Submit or Update Rating
exports.submitOrUpdateRating = async (req, res) => {

    const { storeId } = req.params;
    const { rating } = req.body;

    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            message: 'Rating should be between 1 and 5'
        });
    }

    try {

        await db.query(
            `
            INSERT INTO ratings
            (user_id, store_id, rating)

            VALUES (?, ?, ?)

            ON DUPLICATE KEY UPDATE
            rating = ?
            `,
            [
                userId,
                storeId,
                rating,
                rating
            ]
        );

        res.json({
            message: 'Rating submitted successfully'
        });

    } catch (error) {

        console.error(error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({
                message: 'Store not found'
            });
        }

        res.status(500).json({
            message: 'Unable to submit rating'
        });
    }
};

// Store Owner Dashboard
exports.getStoreOwnerDashboard = async (req, res) => {

    const ownerId = req.user.id;

    try {

        const [storeData] = await db.query(
            `
            SELECT id, name
            FROM stores
            WHERE owner_id = ?
            `,
            [ownerId]
        );

        if (storeData.length === 0) {
            return res.status(404).json({
                message: 'No store assigned to this owner'
            });
        }

        const storeId = storeData[0].id;

        const [averageRatingResult] = await db.query(
            `
            SELECT
            AVG(rating) AS averageRating
            FROM ratings
            WHERE store_id = ?
            `,
            [storeId]
        );

        const [ratingUsers] = await db.query(
            `
            SELECT
                u.name,
                u.email,
                r.rating,
                r.updated_at

            FROM ratings r

            JOIN users u
            ON r.user_id = u.id

            WHERE r.store_id = ?

            ORDER BY r.updated_at DESC
            `,
            [storeId]
        );

        res.json({
            storeName: storeData[0].name,

            averageRating:
                averageRatingResult[0].averageRating
                    ? Number(
                          averageRatingResult[0].averageRating
                      ).toFixed(2)
                    : 'N/A',

            ratings: ratingUsers
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                'Unable to fetch store owner dashboard'
        });
    }
};