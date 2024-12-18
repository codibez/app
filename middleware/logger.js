const colors = require('colors'); 

const logger = (request, response, next) => {
    const methodColors = {
        GET: 'green',
        POST: 'blue',
        PUT: 'yellow',
        DELETE: 'red'
    };
    
    const color = methodColors[request.method] || white;

    console.log(
        `${request.method} ${request.protocol}://${request.get('host')}${request.originalUrl}` [
            color
        ]
    );
    next();
};

module.exports = logger;