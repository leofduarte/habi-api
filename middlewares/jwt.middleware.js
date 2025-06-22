const jwt = require('jsonwebtoken');
const loggerWinston = require('../utils/loggerWinston.utils');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    loggerWinston.debug('Token recebido', { token });
    
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            loggerWinston.error('Erro JWT', { error: JSON.stringify(err) });
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;