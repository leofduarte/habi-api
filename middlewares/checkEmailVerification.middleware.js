const prisma = require('../utils/prisma.utils.js');
const jsend = require('jsend');

const checkEmailVerification = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { is_verified: true }
        });

        if (!user || !user.is_verified) {
            return res.status(403).json(jsend.fail({
                message: 'Please verify your email to continue.',
                code: 'EMAIL_NOT_VERIFIED'
            }));
        }

        next();
    } catch (error) {
        console.error('Error checking email verification:', error);
        res.status(500).json(jsend.error('Error checking email verification status'));
    }
};

module.exports = checkEmailVerification; 