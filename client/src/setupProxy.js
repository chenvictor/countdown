const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/socket',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      ws: true,
    }),
  );
};
