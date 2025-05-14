const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma.utils.js');

router.get('/', async (req, res) => {
    console.log('Health route loaded');
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok', db: 'ok' });
    } catch (e) {
        res.status(500).json({ status: 'error', db: 'fail', error: e.message });
    }
});

module.exports = router;