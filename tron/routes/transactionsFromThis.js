const { Account } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { responseError, responseSuccess } = require('../libs/response');
const { EmptyMessage } = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");

const httpClient = require('../libs/TronClient').httpClient;
const getGrpcClient = require('../libs/TronClient').getGrpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');
const { convertToPrice } = require('../libs/convert');

const Transaction = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const account = new Account(['', '', getBase64AddressFromBase58(address)]);
	// getGrpcClient().solidityApi.getTransactionsFromThis(account)
	getGrpcClient().solidityApi.getNowBlock(new EmptyMessage())
	
		.then(data => {
			return responseSuccess(res, data.toObject());
		})
		.catch(e => {
	    console.log('getTransactionsFromThis error', e);
	  	return responseError(res, 50000, e);
		});
}

module.exports = Transaction;
