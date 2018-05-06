const request = require('request-promise');
const q = require('q');


const { responseError, responseSuccess } = require('../../libs/response');
const mysqlClient = require('../../libs/mysql');
const config = require('../../config');


const saveAddress = (req, res, next) => {
	var { address, userID }= req.body;
	//var userID = "1";
	if(!Array.isArray(address) || userID == null){
		return responseError(res, 3, "params error")
	}
	mysqlClient.query('delete from address where userID = ?', [userID],
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
	const { userID } = req.query;
	mysqlClient.query('select * from address where userID = ?', [userID],
		(error, result, fields) => {
			if(error){
				return responseError(res, 1, "db error");
			}
			var data = []
			var promises = []
			var defer = q.defer()
			for(var i=0; i<result.length; i++){
				data.push({
					type: result[i].type,
					address: result[i].address,
					cny: 0,
					amount: 0,
				})
				if(result[i].type == "btc"){
					var opt = {
						uri: `${config.rpcHost}/v1/api/btc/balance`,
						json: true,
						qs: {
							address: result[i].address
						}
					}
					promises.push(request(opt))
				}else if(result[i].type == "eth"){
					var opt = {
						uri: `${config.rpcHost}/v1/api/eth/balance`,
						json: true,
						qs: {
							address: result[i].address
						}
					}
					promises.push(request(opt))
				}
			}

			q.all(promises).then(function(pData){
				for(let i in pData){
					if(data[i].type == "btc"){
						if(pData[i].ret == 0){
							data[i].amount = pData[i].data.satoshi
							data[i].cny = pData[i].data.cny
						}else{
							throw "request btc balance error"
						}
					}else{
						if(pData[i].ret == 0){
							data[i].amount = pData[i].data.balance
							data[i].cny = pData[i].data.cny
						}else{
							throw "request eth balance error"
						}
					}
				}
				defer.resolve();
				return responseSuccess(res, data)
			}).fail(function(error){
				return responseError(res, 1, error)
			});
			//return responseSuccess(res, data)
		}
	)
}

module.exports = {
	saveAddress,
	getAddress
}
