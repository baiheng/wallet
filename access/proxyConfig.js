const config = {
	v1: {
		'/api/eth/*': 'http://localhost:10001',
		'/api/tron/*': 'http://localhost:10002',
		'/api/vechain/*': 'http://localhost:10003',
	}
}

module.exports = config;