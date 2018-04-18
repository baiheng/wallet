let web3UrlPort = process.env.WEB3PORT;
web3UrlPort = isNaN(parseInt(web3UrlPort)) ? 0 : parseInt(web3UrlPort);
module.exports = {
	isDebug: !!process.env.DEBUG,
	web3Url: `http://localhost:${web3UrlPort || 12080}`, // 本地evm服务地址
	web3RinkebyUrl: `http://localhost:${web3UrlPort || 17080}`, // rinkeby 是以太坊的测试模式
}