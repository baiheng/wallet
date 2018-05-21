
const responseError = (response, ret, msg) => {
	response.json({
		ret,
		msg,
	});
	response.end();
}

const responseSuccess = (response, data, msg) => {
	response.json({
		ret: 0,
		msg: msg || 'success',
		data,
	});
	response.end();
}

module.exports = {
	responseError,
	responseSuccess
}