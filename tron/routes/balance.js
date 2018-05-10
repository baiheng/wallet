const { responseError, responseSuccess } = require('../libs/response');

const httpClient = require('../libs/TronClient').httpClient;
const grpcClient = require('../libs/TronClient').grpcClient;

const { EmptyMessage } = require('@tronprotocol/wallet-api/src/protocol/api/api_pb');
// let latestBlock = Client.getLatestBlock().then(d => console.log('getLatestBlock', d));
// Client.getBlockByNum(41142).then(d => console.log('getBlockByNum', d))

// grpcClient.api.getNowBlock()
// 	.then(data => console.log(data))
// 	.catch(e => console.log(e));
console.log(EmptyMessage);
grpcClient.api.listAccounts(new EmptyMessage() ).then(data => console.log(data));

const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	httpClient.getAccountBalances(address)
		.then(balances => {
	   return responseSuccess(res, { balance: balances });
		})
		.catch(e => {
	    console.log('getBalance error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = balance;
