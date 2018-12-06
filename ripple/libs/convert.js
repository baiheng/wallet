/**
 * 获取实时
 */
const request = require('request-promise');
// https://cn.investing.com/currencyconverter/service/RunConvert?fromCurrency=189&toCurrency=41&fromAmount=1&toAmount=9590&currencyType=1&refreshCharts=true&dateConvert=
function convertToPrice(currency = 'cny') {
	const opt = {
		uri: `https://api.coinmarketcap.com/v1/ticker/ripple/?convert=${currency}`,
		json: true,
	}
	return request(opt).then(data => {
		if (data && data.length > 0)
			return data[0][`price_${currency.toLowerCase()}`];
		else
			throw data;
	});
}

module.exports = {
	convertToPrice
}