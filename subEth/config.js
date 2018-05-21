const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
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
	contractaddress: '0xd850942ef8811f2a866692a623011bde52a462c1',
	ethCgi: `https://api${isDebug ? '-rinkeby' : ''}.etherscan.io/api`,
}