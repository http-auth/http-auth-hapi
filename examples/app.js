// Authentication module.
const auth = require('http-auth');

// Setup auth.
const basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd"
});

const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: 1337,
        host: 'localhost'
    });

    // Register auth plugin.    
    await server.register(require('../src/index'));

    // Setup strategy.
    server.auth.strategy('http-auth', 'http-auth', basic);
    server.auth.default('http-auth');

    server.route({
        method: 'GET',
        path: '/',
        handler: (request) => {
            return `Welcome from Hapi - ${request.auth.credentials.name}!`;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();