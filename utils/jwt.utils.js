const jwt = require('jsonwebtoken');

function generateJwt(user) {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_SECRET_EXPIRATION || '240h' }
    );
}

module.exports = { generateJwt };