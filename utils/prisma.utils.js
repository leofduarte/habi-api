const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient({
  log: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local')
    ? ['query', 'info', 'warn', 'error']
    : ['error']
});

module.exports = prisma;