module.exports = {
	codeValidatePeriod: 5*60,
	authValidatePeriod: 60*60*24*7,
	rpcHost: 'http://139.199.166.104',
	redis: {
        host: '127.0.0.1',
		port: '6379',
	},
	mysql: {
		//host: '127.0.0.1',
		host: '111.230.12.37',
		port: '3306',
		user: 'root',
		password: '',
		database: 'coin'
	}
}
