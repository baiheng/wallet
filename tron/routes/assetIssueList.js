const { EmptyMessage } = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");
const apiClient = require('../libs/apiClient');

const { responseError, responseSuccess } = require('../libs/response');
const { httpClient, grpcClient, getGrpcClient } = require('../libs/TronClient');

const PAGESIZE = 10;

// https://api.tronscan.org/api/token?sort=-name&limit=25&start=25
const assetIssueList = (req, res, next) => {
	const { page } = req.query;
	let pageNum = !isNaN(parseInt(page)) && parseInt(page) >= 0 ? parseInt(page) : 0;
	apiClient(`token?sort=-name&limit=10&start=${pageNum * PAGESIZE}`)
		.then(data => {
			responseSuccess(res, data);
		})
		.catch(e => {
			console.log('assetIssueList error', e);
			responseError(res, 50000, e);
		})
	// getGrpcClient().api.getAssetIssueList(new EmptyMessage())
	// 	.then(list => {
	//    return responseSuccess(res, list.toObject().assetissueList);
	// 	})
	// 	.catch(e => {
	//     console.log('getAssetIssueList error', e);
	//   	return responseError(res, 50000, err.message);
	// 	});
}

module.exports = assetIssueList;
