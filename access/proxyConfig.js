const config = {
	v1: {
		'/api/eth/*': 'http://localhost:10001',
		'/api/tron/*': 'http://localhost:10002',

		'/api/vechain/*': 'http://localhost:10003',
		'/api/eos/*': 'http://localhost:10003',
		'/api/game/*': 'http://localhost:10003',
		'/api/icon/*': 'http://localhost:10003',
		'/api/omisego/*': 'http://localhost:10003',
		'/api/bnb/*': 'http://localhost:10003',

		'/api/bch/*': 'http://localhost:10004',
		'/api/neo/*': 'http://localhost:10005',
		'/api/ltc/*': 'http://localhost:10006',
		'/api/ripple/*': 'http://localhost:10007',
		'/api/etc/*': 'http://localhost:10008',
		'/api/btc/*': 'http://localhost:10009',
	}
}

module.exports = config;
