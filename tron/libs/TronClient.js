const wallet = require("@tronprotocol/wallet-api");

const HttpClient = wallet.HttpClient;
const Client = new HttpClient();

module.exports = Client;