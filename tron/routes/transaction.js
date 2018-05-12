const { TransferContract, TransferAssetContract, VoteWitnessContract, Account } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');
const { Transaction } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');

const { responseError, responseSuccess } = require('../libs/response');
const httpClient = require('../libs/TronClient').httpClient;
const grpcClient = require('../libs/TronClient').grpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');

const {
	hexStr2byteArray,
} = require('@tronprotocol/wallet-api/src/lib/code');

/*const raw = 'Cn8KAjAkIgiE/fYNwWc7qFpoCAESZAotdHlwZS5nb29nbGVhcGlzLmNvbS9wcm90b2NvbC5UcmFuc2ZlckNvbnRyYWN0EjMKFaBJL/OXa7cIiq/T7HgMK2PK3RwSLRIVoGBZdGziDzVhoYODpfS4C9wsISafGIDC1y9wq9b6mrUs'
// const raw = "CoABCgIo+yIIMnmCmTdv7GpaaQgBEmUKLXR5cGUuZ29vZ2xlYXBpcy5jb20vcHJvdG9jb2wuVHJhbnNmZXJDb250cmFjdBI0ChWgSS/zl2u3CIqv0+x4DCtjyt0cEi0SFaBgWXRs4g81YaGDg6X0uAvcLCEmnxiA5JfQEnDK6qqYtSw=";
const t = Buffer.from(raw, 'base64');


function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

const xx = Transaction.deserializeBinary(toArrayBuffer(t));
console.log(Buffer.from(xx.getRawData().serializeBinary()).toString('base64'));
console.log(Buffer.from(xx.serializeBinary()).toString('base64'));
console.log(xx.toObject().rawData);*/
const password = 'D28749C859DA27B23BF928EBAD957FE9233E268C1ADC9876AD24596DA19865AA';

const transaction = async (req, res, next) => {
	const { ownerAddress, toAddress, amount  } = req.body;
	if (!ownerAddress || !toAddress || !amount) {
		return responseError(res, 50001, 'params should not be empty');
	}
	const transferContract = new TransferContract([getBase64AddressFromBase58(ownerAddress), getBase64AddressFromBase58(toAddress), amount]);
	grpcClient.api.createTransaction(transferContract)
		.then(data => {
			// httpClient.signTransactionLocal(password, data)
			// 	.then(d => {
			// 		console.log(Buffer.from(data.getRawData().serializeBinary()).toString('base64'), data.getSignatureList_asB64());
			// 	})
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


/*
"CoABCgIo+yIIMnmCmTdv7GpaaQgBEmUKLXR5cGUuZ29vZ2xlYXBpcy5jb20vcHJvdG9jb2wuVHJhbnNmZXJDb250cmFjdBI0ChWgSS/zl2u3CIqv0+x4DCtjyt0cEi0SFaBgWXRs4g81YaGDg6X0uAvcLCEmnxiA5JfQEnDK6qqYtSw="
 */
/*
	const { EmptyMessage, Address, AccountCreateContract, NumberMessage } = require('@tronprotocol/wallet-api/src/protocol/api/api_pb');
const { TransferContract, TransferAssetContract, VoteWitnessContract, Account } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');

const { 
	getBase58CheckAddressFromPriKeyBase64String,
	getHexStrAddressFromPriKeyBase64String,
	getAddressFromPriKeyBase64String,
	getBase58CheckAddress,
	privateKeyToAddress,
	decode58Check,
	passwordToAddress,
	getAddressFromPriKey,
} = require('@tronprotocol/wallet-api/src/utils/crypto');
const {
	hexStr2byteArray,
	byte2hexStr,
} = require('@tronprotocol/wallet-api/src/lib/code');
// let latestBlock = Client.getLatestBlock().then(d => console.log('getLatestBlock', d));
// Client.getBlockByNum(41142).then(d => console.log('getBlockByNum', d))

// grpcClient.api.getNowBlock()
// 	.then(data => console.log(data))
// 	.catch(e => console.log(e));

// console.log('VoteWitnessContract', new Address(['127.0.0.1', '80001']).toObject());
// const voteWitnessContract = new VoteWitnessContract(['27VkVK7HDp9nHLKrdMj431Aq9xXyLWAgtHa', [['27cEZa99jVaDkujPwzZuHYgkYNqv6zzYLSP', 753003835], ['27Wkfa5iEJtsKAKdDzSmF1b2gDm5s49kvdZ', 752102923]], true]);
// console.log('VoteWitnessContract', voteWitnessContract, voteWitnessContract.toObject());
// grpcClient.api.voteWitnessAccount(voteWitnessContract)
// 	.then(data => console.log('voteWitnessContract success', data.toObject()))
// 	.catch(e => console.log('voteWitnessContract error', e));
grpcClient.api.listAccounts(new EmptyMessage())
	.then(data => {
		const accounts = data.toObject().accountsList.sort((a, b) => b.balance - a.balance);
		accounts.filter(acc => acc.address === 'oCWjquObJKJX+VdpxwHo1peOvp/F').map(acc => {
			const address = Buffer.from(acc.address, 'base64');
			const b58Address = getBase58CheckAddress(hexStr2byteArray(address.toString('hex')));
			const tmp = decode58Check(b58Address);
			console.log(b58Address, Buffer.from(tmp).toString('base64'));
			// console.log(getBase58CheckAddress(hexStr2byteArray(address.toString('hex'))));
		});
		// console.log('listAccounts success', data.toObject());
	})
	.catch(e => console.log('listAccounts error', e))

// const trasaction = new TransferContract(['A0E11973395042BA3C0B52B4CDF4E15EA77818F275', 'a0f6d4ac051d1f0ba8e806e233d6bcbaaf234f0ec7', 40000]);
const trasaction = new TransferContract(['oENkiWWF0AlG4jxRg/9fWp5QeeLk', 'oM3ZnE370cpwUseGkq6z/1ZusGx1', 40000]);
console.log(trasaction.toObject());
grpcClient.api.createTransaction(trasaction)
	.then(data => {
		const tmp = Buffer.from(data.serializeBinary());
		console.log(tmp.toString('base64'));
	})
	.catch(e => console.log('createTransaction error', e))
// console.log(new Account(['','','oENkiWWF0AlG4jxRg/9fWp5QeeLk']).toObject());
// grpcClient.api.getAccount(new Account(['','','oENkiWWF0AlG4jxRg/9fWp5QeeLk']))
// 	.then(data => console.log('getAccount success', data.toObject()))
// 	.catch(e => console.log('getAccount error', e));
	


// grpcClient.solidityApi.getTransactionsToThis(new Account(['','','oENkiWWF0AlG4jxRg/9fWp5QeeLk']))
// 	.then(data => console.log('listAccounts success', data.toObject()))
// 	.catch(e => console.log('listAccounts error', e))

// "CoEBCgIVuyIIivFnP6qlfiFaaggBEmYKLXR5cGUuZ29vZ2xlYXBpcy5jb20vcHJvdG9jb2wuVHJhbnNmZXJDb250cmFjdBI1ChWgSS/zl2u3CIqv0+x4DCtjyt0cEi0SFaBgWXRs4g81YaGDg6X0uAvcLCEmnxiA6O2hugFw6J6kkbUs"

// const number = new NumberMessage([100]);
// console.log(number.toObject());
// grpcClient.api.getBlockByNum(number)
// 	.then(data => console.log('getBlockByNum success', data.toObject()))
// 	.catch(e => console.log('getBlockByNum error', e))


 */