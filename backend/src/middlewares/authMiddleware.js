const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = decoded.user;

            next();
        } catch (error) {
            console.error(error);

            return res.status(401).json({
                message: 'Invalid token'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({
            message: 'Admin access only'
        });
    }
};

module.exports = {
    protect,
    isAdmin
};