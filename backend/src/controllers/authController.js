const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwtHelper');

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
        return res.status(400).json({
            message: 'Please fill all required fields'
        });
    }

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: 'Name must be between 20 and 60 characters'
        });
    }

    if (address.length > 400) {
        return res.status(400).json({
            message: 'Address cannot exceed 400 characters'
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                'Password must be 8-16 characters with one uppercase letter and one special character'
        });
    }

    try {
        const [existingUser] = await db.query(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        await db.query(
            `INSERT INTO users
            (name, email, address, password, role)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                address,
                encryptedPassword,
                'USER'
            ]
        );

        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error during registration'
        });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    try {
        const [userRows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (userRows.length === 0) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const currentUser = userRows[0];

        const passwordMatched = await bcrypt.compare(
            password,
            currentUser.password
        );

        if (!passwordMatched) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(
            currentUser.id,
            currentUser.role
        );

        res.json({
            token,
            user: {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error during login'
        });
    }
};