# http-auth-hapi
[Hapi framework](https://hapi.dev/) integration with [http-auth](https://github.com/http-auth/http-auth) module.

[![build](https://github.com/http-auth/http-auth-hapi/workflows/build/badge.svg)](https://github.com/http-auth/http-auth-hapi/actions?query=workflow%3Abuild)

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

## Issues

You can find list of issues using **[this link](http://github.com/http-auth/http-auth-hapi/issues)**.

## Requirements

 - **[Node.js](http://nodejs.org)** - Event-driven I/O server-side JavaScript environment based on V8.
 - **[npm](http://npmjs.org)** - Package manager. Installs, publishes and manages node programs.

## License

The MIT License (MIT)

Copyright (c) Gevorg Harutyunyan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
