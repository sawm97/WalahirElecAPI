const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the backend',
        },
        servers: [
            {
                url: 'https://walahirelecapi.azurewebsites.net/api/products',
            },
            {
                url: 'https://walahirelecapi.azurewebsites.net/api/products',
            },
        ],
    },
    apis: ['../routes/productRoutes.js', '../routes/categoryRoutes.js'] // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;