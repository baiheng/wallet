const verifyCode = require('./verifyCode');
const login = require('./login');
const { saveAddress, getAddress } = require('./address');

module.exports = {
	verifyCode,
	login,
	saveAddress,
	getAddress
}
