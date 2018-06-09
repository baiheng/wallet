
const {EmptyMessage, NumberMessage} = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");
const {WalletClient, WalletSolidityClient} = require("@tronprotocol/wallet-api/src/protocol/api/api_grpc_pb");


class GrpcClient {

  constructor(options) {
    const { fullNode = {}, solidity = {} } = options;
    this.hostname = fullNode.hostname;
    this.port = fullNode.port;
    const caller = require('grpc-caller');
    /**
     * @type {WalletClient}
     */
    this.api = caller(`${this.hostname}:${this.port}`, WalletClient);
    this.solidityApi = caller(`${solidity.hostname}:${solidity.port}`, WalletSolidityClient);
  }

  /**
   * Retrieve all connected witnesses
   *
   * @returns {Promise<*>}
   */
  async getWitnesses() {
    return await this.api.listWitnesses(new EmptyMessage())
      .then(x => x.getWitnessesList());
  }

  /**
   * Retrieve all connected nodes
   *
   * @returns {Promise<*>}
   */
  async getNodes() {
    return await this.api.listNodes(new EmptyMessage())
      .then(x => x.getNodesList());
  }

  /**
   * Retrieve all accounts
   *
   * @returns {Promise<*>}
   */
  async getAccounts() {
    return await this.api.listAccounts(new EmptyMessage())
      .then(x => x.getAccountsList());
  }


  /**
   * Retrieves a block by the given number
   *
   * @param {number} number block number
   * @returns {Promise<*>}
   */
  async getBlockByNumber(number) {
    let message = new NumberMessage();
    message.setNum(number);
    return await this.api.getBlockByNum(message);
  }

}

module.exports = GrpcClient;
