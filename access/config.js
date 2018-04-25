module.exports = {
	codeValidatePeriod: 5*60,
	authValidatePeriod: 60*60*24*7,
	rpcHost: 'http://test-coin.xiaoshutech.com',
	redis: {
		host: '127.0.0.1',
		port: '6379',
	},
	mysql: {
		host: '127.0.0.1',
		port: '3306',
		user: 'root',
		password: '',
		database: 'coin'
	}
}
