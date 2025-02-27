const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the backend of the Walahirelec project',
        },
        servers: [
            {
                url: 'https://walahirelecapi.azurewebsites.net/api',
            }
        ],
    },
    apis: ['./routes/*.js'] // Path to the API docs
    // apis: ['./routes/productRoutes.js', './routes/categoryRoutes.js'] // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;