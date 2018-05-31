const { EmptyMessage } = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");

const { responseError, responseSuccess } = require('../libs/response');
const httpClient = require('../libs/TronClient').httpClient;
const getGrpcClient = require('../libs/TronClient').getGrpcClient;
const { getBase64AddressFromBase58, getBase58AddressFromBase64 } = require('../libs/tool/address');

const witnesses = (req, res, next) => {
	getGrpcClient().api.listWitnesses(new EmptyMessage())
		.then(data => {
			const witnesses = data.toObject().witnessesList.map(obj => ({
				...obj,
				address: getBase58AddressFromBase64(obj.address, 'base64'),
			}));

	   return responseSuccess(res, witnesses);
		})
		.catch(e => {
	    console.log('getBalance error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = witnesses;
