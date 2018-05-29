let web3UrlPort = process.env.WEB3PORT;
web3UrlPort = isNaN(parseInt(web3UrlPort)) ? 0 : parseInt(web3UrlPort);
const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
module.exports = {
	isDebug,
	web3Url: `http://localhost:${web3UrlPort || 8555}`, // 本地evm服务地址
	cgi: `http://etcchain.com/`
}