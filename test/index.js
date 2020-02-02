const Hapi = require('@hapi/hapi');

// Source.
const auth = require('http-auth');

// Request module.
const request = require('request');

// Expect module.
const expect = require('chai').expect;

const server = Hapi.server({
    port: 1337,
    host: 'localhost'
});

const init = async (basic) => {
    // Register auth plugin.    
    await server.register(require('../src/index'));

    // Setup strategy.
    server.auth.strategy('http-auth', 'http-auth', basic);
    server.auth.default('http-auth');

    server.route({
        method: 'GET',
        path: '/',
        handler: (request) => {
            return `Welcome to private area - ${request.auth.credentials.name}!`;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// Express.
describe('hapi', function () {
    before(function () {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area."
        }, function (username, password, done) {
            if (username === 'gevorg') {
                done(new Error("Error comes here"));
            } else if (username === "mia" && password === "supergirl") {
                done(true);
            } else if (username === "ColonUser" && password === "apasswordwith:acolon") {
                done(true);
            } else {
                done(false);
            }
        });

        init(basic);
    });

    after(function () {
        server.stop();
    });

    it('error', function (done) {
        const callback = function (_error, _response, body) {
            expect(body).to.equal(`{"statusCode":400,"error":"Bad Request","message":"Error comes here"}`);
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });

    it('success', function (done) {
        const callback = function (error, response, body) {
            expect(body).to.equal("Welcome to private area - mia!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('mia', 'supergirl');
    });

    it('wrong password', function (done) {
        const callback = function (error, response, body) {
            expect(body).to.equal(`{"statusCode":401,"error":"Unauthorized","message":"401 Unauthorized","attributes":{"error":"401 Unauthorized"}}`);
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('mia', 'cute');
    });

    it('wrong user', function (done) {
        const callback = function (error, response, body) {
            expect(body).to.equal(`{"statusCode":401,"error":"Unauthorized","message":"401 Unauthorized","attributes":{"error":"401 Unauthorized"}}`);
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('Tina', 'supergirl');
    });

    it('password with colon', function (done) {
        const callback = function (error, response, body) {
            expect(body).to.equal("Welcome to private area - ColonUser!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('ColonUser', 'apasswordwith:acolon');
    });
});