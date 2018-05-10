const wallet = require("@tronprotocol/wallet-api");

const HttpClient = wallet.HttpClient;
const GrpcClient = wallet.GrpcClient;

const httpClient = new HttpClient();
const grpcClient = new GrpcClient({
	hostname: "localhost",
  port: 50051,
});
module.exports = {
	httpClient,
	grpcClient
};