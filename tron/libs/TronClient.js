const wallet = require("@tronprotocol/wallet-api");

const GrpcClient = require('./GrpcClient');

const HttpClient = wallet.HttpClient;
// const GrpcClient = wallet.GrpcClient;
const httpClient = new HttpClient();
const grpcClient = new GrpcClient({
	hostname: "39.106.220.120",
  port: 50051,
});

const getGrpcClient = () =>  {
	return new GrpcClient({
		fullNode: { hostname: "39.106.220.120", port: 50051 },
		solidity: { hostname: "34.213.191.109", port: 18888 },
	})
}
module.exports = {
	httpClient,
	grpcClient,
	getGrpcClient
};

/*

	fullnode = {
  ip.list = [
    #"39.105.111.178:50051",
    #"39.105.104.137:50051",
    "47.93.9.236:50051",
    "47.93.33.201:50051",
  ]
}

solidityNode = {
  ip.list = [
  "47.93.9.236:18897",
    #"127.0.0.1:50051",
    #"39.105.66.80:50051",
    #"47.254.39.153:50051",
    #"47.89.244.227 :50051",
  ]
}
 */

/*
	tron rpc server
	https://github.com/tronprotocol/wiki/blob/master/docs/tron_clients.rst
	IP	Location	Description
	47.254.16.55	Silicon Valley	Witness Node
	47.254.18.49	Silicon Valley	Witness Node
	18.188.111.53	Ohio	Witness Node
	54.219.41.56	California	Witness Node
	35.169.113.187	Virginia	Witness Node
	34.214.241.188	Oregon	Witness Node
	47.254.146.147	Frankfurt	Witness Node
	47.254.144.25	Frankfurt	Witness Node
	47.91.246.252	Hongkong	Witness Node
	47.91.216.69	Hongkong	Witness Node
	39.106.220.120	Beijing	Witness Node
	47.95.14.107	Beijing	Blockchain Explorer
 */