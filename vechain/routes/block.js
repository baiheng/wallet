const { responseError, responseSuccess } = require('../libs/response');
const etherscan = require('../libs/etherscan');
const request = require('request-promise');
const config = require('../config');

const staticResult = {
	txsCount: 0,
	lastModify: Date.now(),
}
const uri = `https://ethplorer.io/service/service.php?data=${config.contractaddress}`;
// https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=YourApiKeyToken
// 
// https://ethplorer.io/service/service.php?data=0xd850942ef8811f2a866692a623011bde52a462c1
const getBlockNumber = (req, res, next) => {
	const now = Date.now();
	console.log(staticResult);
	if (staticResult.txsCount && now - staticResult.lastModify <= 20 * 1000)
		return responseSuccess(res, { blockNumber: staticResult.txsCount });
	request({ uri, json: true })
		.then(data => {
			staticResult.txsCount = data.contract.txsCount;
			staticResult.lastModify = now;
			return responseSuccess(res, { blockNumber: staticResult.txsCount })
		})
		.catch(e => {
			console.log('getBlockNumber error', e);
	  	return responseError(res, 50000, e.message);
		})
/*
	const option = {
		module: 'proxy',
		action: 'eth_blockNumber',
	}
	etherscan(option)
		.then(data => {
			const blockNumber = isNaN(parseInt(data.result)) ? 0 : parseInt(data.result);
	   	return responseSuccess(res, { blockNumber });
		})
		.catch(e => {
			console.log('getBlockNumber error', e);
	  	return responseError(res, 50000, e.message);
		})*/
}

module.exports = getBlockNumber;


