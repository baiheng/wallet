const { 
	getBase58CheckAddress,
	decode58Check,
} = require('@tronprotocol/wallet-api/src/utils/crypto');
const {
	hexStr2byteArray,
} = require('@tronprotocol/wallet-api/src/lib/code');


const getBase58AddressFromBase64 = (address) => {
	const addr = Buffer.from(address, 'base64');
	return getBase58CheckAddress(hexStr2byteArray(addr.toString('hex')));
}

const getBase64AddressFromBase58 = (address) => {
	const addr = decode58Check(address);
	return Buffer.from(addr).toString('base64');
}

module.exports = {
	getBase58AddressFromBase64,
	getBase64AddressFromBase58,
}