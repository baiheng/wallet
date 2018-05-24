const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
module.exports = {
	isDebug,
	rpcUrl: 'http://neoscan.io/api/main_net/v1/',
	neoAssetAddress: '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
}