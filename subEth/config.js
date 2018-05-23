const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
let web3UrlPort = process.env.WEB3PORT;
web3UrlPort = isNaN(parseInt(web3UrlPort)) ? 0 : parseInt(web3UrlPort);

module.exports = {
	isDebug,
	ethApiKey: 'KHSA7WKCA5TRY7JWUNNMXB5FRS9HB72UR8',
	contracts: [
		{
			name: 'eos',
			address: '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
		},
		{
			name: 'vechain',
			address: '0xd850942ef8811f2a866692a623011bde52a462c1',
		}
	],
	web3Url: `http://localhost:${web3UrlPort || 8545}`, // 本地evm服务地址
	ethCgi: `https://api${isDebug ? '-rinkeby' : ''}.etherscan.io/api`,
}