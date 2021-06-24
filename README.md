# http-auth-hapi
[Hapi framework](https://hapi.dev/) integration with [http-auth](https://github.com/gevorg/http-auth) module.

[![build](https://github.com/http-auth/http-auth-hapi/workflows/build/badge.svg)](https://github.com/http-auth/http-auth-hapi/actions/workflows/build.yml)

## Installation

Via git (or downloaded tarball):

```bash
$ git clone git://github.com/http-auth/http-auth-hapi.git
```
Via [npm](http://npmjs.org/):

```bash
$ npm install http-auth-hapi
```    

## Usage
```javascript
// Authentication module.
// eslint-disable-next-line node/no-unpublished-require
const auth = require("http-auth");

// Setup auth.
const basic = auth.basic({
  realm: "Simon Area.",
  file: __dirname + "/../data/users.htpasswd"
});

// eslint-disable-next-line node/no-unpublished-require
const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.server({
    port: 1337,
    host: "localhost"
  });

  // Register auth plugin.
  await server.register(require("http-auth-hapi"));

  // Setup strategy.
  server.auth.strategy("http-auth", "http-auth", basic);
  server.auth.default("http-auth");

  server.route({
    method: "GET",
    path: "/",
    handler: request => {
      return `Welcome from Hapi - ${request.auth.credentials.name}!`;
    }
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

init();
```


## Running tests

It uses [mocha](https://mochajs.org/), so just run following command in package directory:

```bash
$ npm test
```

## License

The MIT License (MIT)