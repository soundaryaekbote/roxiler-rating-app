const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Password Validation
const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

// Create User (Admin Only)
exports.createUserByAdmin = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
        return res.status(400).json({
            message: 'Please provide all required fields'
        });
    }

    // Name Validation
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: 'Name should be between 20 and 60 characters'
        });
    }

    // Address Validation
    if (address.length > 400) {
        return res.status(400).json({
            message: 'Address cannot exceed 400 characters'
        });
    }

    // Role Validation
    const allowedRoles = ['ADMIN', 'USER', 'OWNER'];

    if (!allowedRoles.includes(role.toUpperCase())) {
        return res.status(400).json({
            message: 'Invalid role selected'
        });
    }

    // Password Validation
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                'Password must be 8-16 characters and contain one uppercase letter and one special character'
        });
    }

    try {
        const [existingUser] = await db.query(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            `
            INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                hashedPassword,
                address,
                role.toUpperCase()
            ]
        );

        res.status(201).json({
            message: 'User created successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error while creating user'
        });
    }
};

// Get All Users (Admin Only)
exports.getAllUsersByAdmin = async (req, res) => {

    const {
        name,
        email,
        address,
        role,
        sortBy = 'name',
        order = 'ASC'
    } = req.query;

    let query =
        'SELECT id, name, email, address, role FROM users WHERE 1=1';

    const values = [];

    if (name) {
        query += ' AND name LIKE ?';
        values.push(`%${name}%`);
    }

    if (email) {
        query += ' AND email LIKE ?';
        values.push(`%${email}%`);
    }

    if (address) {
        query += ' AND address LIKE ?';
        values.push(`%${address}%`);
    }

    if (role) {
        query += ' AND role = ?';
        values.push(role);
    }

    const allowedSortFields = [
        'name',
        'email',
        'address',
        'role'
    ];

    const finalSortField =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : 'name';

    const finalOrder =
        order.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

    query += ` ORDER BY ${finalSortField} ${finalOrder}`;

    try {
        const [users] = await db.query(query, values);

        res.json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error while fetching users'
        });
    }
};

// Get Single User Details
exports.getUserByIdByAdmin = async (req, res) => {

    const { id } = req.params;

    try {

        const [users] = await db.query(
            `
            SELECT
            id,
            name,
            email,
            address,
            role
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        // If Owner, return store rating details too
        if (user.role === 'OWNER') {

            const [storeData] = await db.query(
                `
                SELECT
                    s.id,
                    s.name,
                    AVG(r.rating) AS averageRating
                FROM stores s
                LEFT JOIN ratings r
                ON s.id = r.store_id
                WHERE s.owner_id = ?
                GROUP BY s.id
                `,
                [id]
            );

            return res.json({
                ...user,
                storeDetails:
                    storeData.length > 0
                        ? storeData[0]
                        : null
            });
        }

        res.json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error while fetching user'
        });
    }
};

// Update Password
exports.updateUserPassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            message:
                'Please provide old password and new password'
        });
    }

    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message:
                'Password must be 8-16 characters and contain one uppercase letter and one special character'
        });
    }

    try {

        const [users] = await db.query(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        const passwordMatched =
            await bcrypt.compare(
                oldPassword,
                user.password
            );

        if (!passwordMatched) {
            return res.status(401).json({
                message: 'Incorrect old password'
            });
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        await db.query(
            `
            UPDATE users
            SET password = ?
            WHERE id = ?
            `,
            [hashedPassword, userId]
        );

        res.json({
            message:
                'Password updated successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                'Server error while updating pasword'
        });
    }
};