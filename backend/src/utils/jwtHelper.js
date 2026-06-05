const jwt = require('jsonwebtoken');

const createJwtToken = (userId, role) => {
    return jwt.sign(
        {
            user: {
                id: userId,
                role
            }
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );
};

module.exports = {
    createJwtToken
};