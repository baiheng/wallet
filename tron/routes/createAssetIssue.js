const { AssetIssueContract } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');

const { responseError, responseSuccess } = require('../libs/response');
const getGrpcClient = require('../libs/TronClient').getGrpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');

const transaction = async (req, res, next) => {
    const { ownerAddress, name, totalSupply = 100000, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url  } = req.body;
    if (!ownerAddress || !name) {
        return responseError(res, 50001, 'params should not be empty');
    }
    const assetIssueContract = new AssetIssueContract([]);
    assetIssueContract.setOwnerAddress(getBase64AddressFromBase58(ownerAddress));
    assetIssueContract.setName(new Uint8Array(Buffer.from(name)));
    assetIssueContract.setTotalSupply(totalSupply);
    assetIssueContract.setTrxNum(trxNum);
    assetIssueContract.setNum(num);
    assetIssueContract.setStartTime(startTime);
    assetIssueContract.setEndTime(endTime);
    assetIssueContract.setDecayRatio(decayRatio);
    assetIssueContract.setVoteScore(voteScore);
    assetIssueContract.setDescription(new Uint8Array(Buffer.from(description)));
    assetIssueContract.setUrl(new Uint8Array(Buffer.from(url)));
    getGrpcClient().api.createAssetIssue(assetIssueContract)
        .then(data => {
            if (!data.getRawData())
                throw data.toObject();
            return responseSuccess(res, {
            rawData: Buffer.from(data.getRawData().serializeBinary()).toString('base64'),
        });

        })
        .catch(e => {
            console.log('createTransaction error', e);
            return responseError(res, 50000, e);
        })
}

module.exports = transaction;

