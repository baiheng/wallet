const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
module.exports = {
	isDebug,
	rpcUrl: 'http://neoscan.io/api/main_net/v1/',
}