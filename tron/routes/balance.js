const { EmptyMessage } = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");
const { Account } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { responseError, responseSuccess } = require('../libs/response');

const httpClient = require('../libs/TronClient').httpClient;
const getGrpcClient = require('../libs/TronClient').getGrpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');
const { convertToPrice } = require('../libs/convert');

const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const account = new Account(['', '', getBase64AddressFromBase58(address)]);
	Promise.all([getGrpcClient().api.getAccount(account), convertToPrice('cny'), getGrpcClient().api.getNowBlock(new EmptyMessage())])
		.then(data => {
			const tmpBalance = data[0].toObject();
			const price = data[1];
			const bal = tmpBalance.balance / 1e6;
			const blockNumber = data[2].getBlockHeader().toObject().rawData.number
			return responseSuccess(res, { ...tmpBalance, balance: bal, cny: bal * price, nonce: blockNumber + 1 });
		})
		.catch(e => {
	    console.log('getBalance error', e);
	  	return responseError(res, 50000, err.message);
		});
	// grpcClient.api.getAccount(account)
	// 	.then(balances => {
	// 		console.log(balances.toObject());
	//    return responseSuccess(res, { ...balances.toObject() });
	// 	})
	// 	.catch(e => {
	//     console.log('getBalance error', e);
	//   	return responseError(res, 50000, err.message);
	// 	});
}

module.exports = balance;
