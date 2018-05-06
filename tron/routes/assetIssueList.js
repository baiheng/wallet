const { responseError, responseSuccess } = require('../libs/response');

const TronClient = require('../libs/TronClient');

// 
const assetIssueList = (req, res, next) => {
	TronClient.getAssetIssueList()
		.then(list => {
	   return responseSuccess(res, { assetIssueList: list });
		})
		.catch(e => {
	    console.log('getAssetIssueList error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = assetIssueList;
