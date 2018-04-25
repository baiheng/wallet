const request = require('request-promise');


const { responseError, responseSuccess } = require('../../libs/response');
const mysqlClient = require('../../libs/mysql');
const config = require('../../config');


const saveAddress = (req, res, next) => {
	var address = req.body;
	var userID = "1"
	mysqlClient.query('delete from address where userID = "1"',
		(error, result, fields) => {
			if(error){
				return responseError(res, 1, "db error");
			}
			for(var i of address){
				mysqlClient.query('insert into address (type, address, userID) values(?,?,?)',
				[i.type, i.address, userID],
				(error, result) => {
					if(error){
						return responseError(res, 1, "db error");
					}
				})
			}
		}
	)
	return responseSuccess(res, {});
}

const getAddress = (req, res, next) => {
	mysqlClient.query('select * from address where userID = "1"',
		(error, result, fields) => {
			if(error){
				return responseError(res, 1, "db error");
			}
			var data = []
			for(var i=0; i<result.length; i++){
				/*
				if(result[i].type == "btc"){
					var opt = {
						uri: `${config.rpcHost}/v1/api/btc/balance`,
						json: true,
						qs: {
							address: result[i].address
						}
					}
					request(opt).then(data => {
						if (data.ret !== 0){
						}
					})
				}
				*/
				data.push({
					type: result[i].type,
					address: result[i].address,
					cny: 0,
					amount: 0,
				})
			}
			return responseSuccess(res, data)
		}
	)
}

module.exports = {
	saveAddress,
	getAddress
}
