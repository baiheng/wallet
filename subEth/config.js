const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
let web3UrlPort = process.env.WEB3PORT;
web3UrlPort = isNaN(parseInt(web3UrlPort)) ? 0 : parseInt(web3UrlPort);

module.exports = {
	isDebug,
	ethApiKey: 'KHSA7WKCA5TRY7JWUNNMXB5FRS9HB72UR8',
	alias: {
		bnb: 'binance-coin',
	},
	contracts: [
		{
			name: 'eos',
			address: '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
		},
		{
			name: 'icon',
			address: '0xb5a5f22694352c15b00323844ad545abb2b11028',
		},
		{
			name: 'omisego',
			address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
		},
		{
			name: 'game',
			address: '0xB70835D7822eBB9426B56543E391846C107bd32C',
		},
		{
			name: 'bnb',
			address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
		},
		{
			name: 'vechain',
			address: '0xd850942ef8811f2a866692a623011bde52a462c1',
		}
	],
	web3Url: `http://localhost:${web3UrlPort || 8545}`, // 本地evm服务地址
	ethCgi: `https://api${isDebug ? '-rinkeby' : ''}.etherscan.io/api`,
}
