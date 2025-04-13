const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Habi API',
            version: '1.0.0',
            description: 'API documentation for Habi application',
            contact: {
                name: 'habi',
                email: 'habi-app@proton.me',
            }
        },
        servers: [
            {
                url: 'http://localhost:8080/api/v1',
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/*.routes.js', './app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;