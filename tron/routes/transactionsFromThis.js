const { Account } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { responseError, responseSuccess } = require('../libs/response');

const httpClient = require('../libs/TronClient').httpClient;
const grpcClient = require('../libs/TronClient').grpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');
const { convertToPrice } = require('../libs/convert');

const Transaction = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const account = new Account(['', '', getBase64AddressFromBase58(address)]);
	grpcClient.solidityApi.getTransactionsFromThis(account)
		.then(data => {
			return responseSuccess(res, data.toObject());
		})
		.catch(e => {
	    console.log('getTransactionsFromThis error', e);
	  	return responseError(res, 50000, e);
		});
}

module.exports = Transaction;
