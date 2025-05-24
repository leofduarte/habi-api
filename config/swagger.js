const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const yaml = require('js-yaml');

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
            {
                url: 'https://habi-api-dvxvh.ondigitalocean.app/api/v1',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.routes.js', './app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const yamlSpec = yaml.dump(swaggerSpec);
fs.writeFileSync('./config/openapi.yml', yamlSpec, 'utf8');

module.exports = swaggerSpec;