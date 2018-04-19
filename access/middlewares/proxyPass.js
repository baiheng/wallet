const proxy = require('http-proxy-middleware');
const _ = require('lodash')
;
const proxyConfig = require('../proxyConfig');

const enhanceProxyPass = (app) => {
	const config = proxyConfig || {};
	_.forEach(config, (dest, path) => app.use(path, proxy({ target: dest, changeOrigin: true })))
}

module.exports = enhanceProxyPass;
