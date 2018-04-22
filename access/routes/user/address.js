const request = require('request-promise');


const { responseError, responseSuccess } = require('../../libs/response');
const redisClient = require('../../libs/redis');
const config = require('../../config');


const saveAddress = (req, res, next) => {
	const { address } = req.body;
	return responseSuccess(res, {});
}

const getAddress = (req, res, next) => {
	var t = [];
	t.push({
		type: "btc",
		amount: 10,
		cny: 100,
		address: "123123131"
	})
	t.push({
		type: "eth",
		amount: 11,
		cny: 200,
		address: "1adfa23123131"
	})
	return responseSuccess(res, t);
}

module.exports = {
	saveAddress,
	getAddress
}
