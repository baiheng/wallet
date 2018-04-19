const proxy = require('http-proxy-middleware');
const _ = require('lodash')
;
const proxyConfig = require('../proxyConfig');

const enhanceProxyPass = (app) => {
	const config = proxyConfig || {};
	_.forEach(config, (rules, version) => {
		_.forEach(rules, (dest, path) => app.use(`/${version}${path}`, proxy({
			target: dest,
			changeOrigin: true,
			pathRewrite: {
        [`/${version}${path}`] : path.replace(/\*$/, ''),     // rewrite path
      },
		})))
	})
}

module.exports = enhanceProxyPass;
