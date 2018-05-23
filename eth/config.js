let web3UrlPort = process.env.WEB3PORT;
web3UrlPort = isNaN(parseInt(web3UrlPort)) ? 0 : parseInt(web3UrlPort);
const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
module.exports = {
	isDebug,
	web3Url: `http://localhost:${web3UrlPort || 8545}`, // 本地evm服务地址
	web3RinkebyUrl: `http://localhost:${web3UrlPort || 8545}`, // rinkeby 是以太坊的测试模式
	ethApiKey: 'KHSA7WKCA5TRY7JWUNNMXB5FRS9HB72UR8',
	// ethCgi: `http://localhost:8001`,
	ethCgi: `https://api${isDebug ? '-rinkeby' : ''}.etherscan.io/api`
}