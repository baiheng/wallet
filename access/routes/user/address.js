const request = require('request-promise');
const q = require('q');


const { responseError, responseSuccess } = require('../../libs/response');
const mysqlClient = require('../../libs/mysql');
const config = require('../../config');

const coinList = ["btc", "eth", "etc", "bch", "ltc", "eos", "ripple", "game", "icon", "omisego", "vechain", 'bnb']

const saveAddress = (req, res, next) => {
	var { address, userID, devUdid }= req.body;
	if(!Array.isArray(address) || userID == null){
		return responseError(res, 3, "params error")
	}
	var promises = []
	var defer = q.defer()

    // 记录设备id
    if (typeof devUdid != 'undefinded' && devUdid != '') {
        var opt = mysqlClient.query('select * from device where userID = ? and udid = ?', [userID, devUdid],
            (err, res, fields) => {
                if (err) {
                    return "db error " + err;
                }
                if (res.length == 0) {
                    let sql = 'insert into device (userID, udid) values ("' + userID + '","' + devUdid + '")'
                    mysqlClient.query(sql, (err) => {
                        if (err) {
                            return "db error " + err;
                        }
                    });
                }
            }
        );
        promises.push(opt);
    }

	for (let i of address) {
		if (-1 == coinList.indexOf(i.type)) {
			continue
		}
		var opt = mysqlClient.query('select * from address where userID = ? and type = ?', [userID, i.type],
			(error, result, fields) => {
				if (error) {
					return "db error " + error
				}
				if (result.length == 0) {
					let sql = 'insert into address (type, address, userID) values ("' + i.type + '", "' + i.address + '", "' + userID + '")'
					mysqlClient.query(sql, (error) => {
							if (error) {
								console.log(error)
								return "db error " + error
							}
						}
					)
				}
				return true
			}
		)
		promises.push(opt)
	}
	q.all(promises).then(function(pData){
		defer.resolve();
		return responseSuccess(res, {});
	}).fail(function(error){
		return responseError(res, 1, error)
	});
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
				if(-1 == coinList.indexOf(result[i].type)){
					continue
				}
				data.push({
					type: result[i].type,
					address: result[i].address,
					cny: 0,
					amount: 0,
				})
				var opt = {
					uri: `${config.rpcHost}/v1/api/${result[i].type}/balance`,
					json: true,
					qs: {
						address: result[i].address
					}
				}
				promises.push(request(opt))
			}

			q.all(promises).then(function(pData){
				for(let i in pData){
					if(pData[i].ret == 0){
						data[i].amount = pData[i].data.balance || 0
						data[i].cny = pData[i].data.cny || 0
					}else{
						// throw "request " + data[i].type +  " balance error"
						data[i].amount = 0
						data[i].cy = 0
						data[i].err = "request " + data[i].type +  " balance error"
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
