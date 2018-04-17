const Web3 = require('web3');
const config = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.web3Url));
const web3Rinkeby = new Web3(new Web3.providers.HttpProvider(config.web3RinkebyUrl));
// 如果是测试环境，则调用eth rinkeby模式
module.exports = !!process.env.DEBUG ? web3Rinkeby : web3;
