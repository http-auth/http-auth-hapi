// HTTP authentication scheme.
const Boom = require("@hapi/boom");

const httpScheme = function httpScheme(server, auth) {
  return {
    authenticate: async function authenticate(request, h) {
      const result = await new Promise(resolve => {
        // Is auth.
        auth.isAuthenticated(request, function(result) {
          if (result instanceof Error) {
            throw Boom.badRequest(result);
          } else if (!result.pass) {
            const header = auth.generateHeader(result);
            throw Boom.unauthorized(auth.options.msg401, header);
          } else {
            resolve(h.authenticated({ credentials: { name: result.user } }));
          }
        });
      });

      return result;
    }
  };
};

module.exports.plugin = {
  pkg: require("../package.json"),
  register(server) {
    server.auth.scheme("http-auth", httpScheme);
  }
};
