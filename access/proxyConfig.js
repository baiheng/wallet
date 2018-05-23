const config = {
	v1: {
		'/api/eth/*': 'http://localhost:10001',
		'/api/tron/*': 'http://localhost:10002',
		'/api/vechain/*': 'http://localhost:10003',
		'/api/eos/*': 'http://localhost:10003',
		'/api/bch/*': 'http://localhost:10004',
		'/api/neo/*': 'http://localhost:10005',
	}
}

module.exports = config;
