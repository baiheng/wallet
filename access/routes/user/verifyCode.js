const request = require('request-promise');


const { responseError, responseSuccess } = require('../../libs/response');
const redisClient = require('../../libs/redis');
const config = require('../../config');

const REDISPREFIX = 'VERIFYCODE:';
const { codeValidatePeriod = 5*60 } = config;
const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

/**
 * 判断手机号码是否已经发送过验证码
 * @param  {string} phone 手机号码
 * @return {Promise}       [description]
 */
// function checkPhoneInVerifying(phone) {
// 	return new Promise((resolve, reject) => {
// 		redisClient.get(`${REDISPREFIX}${phone}`, (err, result) => {
// 		console.log('fuck', err, result);
// 			if (err) return reject(e);
// 			if (!result) return resolve('');
// 			reject({ ret: 51003, msg: `接口调用太频繁，请${codeValidatePeriod}s之后再调用` });
// 		});
// 	})
// }

function setVerifyCode(phone, code) {
	return new Promise((resolve, reject) => {
		redisClient.set(`${REDISPREFIX}${phone}`, code, 'EX', codeValidatePeriod, (err, result) => {
			if (err) return reject(e);
			resolve('');
		});
		
	})
}

function getRPCVerifyCode(phone) {
	// return Promise.resolve({
	// 	ret: 0,
	// 	data: Math.floor(Math.random()*10000),
	// })
	const opt = {
		uri: `${config.rpcHost}/v1/api/account/user`,
		json: true,
		qs: {
			phone,
			action: 'code',
		}
	}
	return request(opt)
}

const sendVerifyCode = (req, res, next) => {
	const { phone } = req.query;
	if (!phone || !phone.match(phoneReg))
		return responseError(res, 51001, 'phone number is wrong');

	
	// checkPhoneInVerifying(phone)
	// 	.then(data => { // 该手机号码尚未下发短信或者短信下发超过codeValidatePeriod这个时间
	// 		// return getRPCVerifyCode(phone);
	// 		return {
	// 			ret: 0,
	// 			data: '6666',
	// 		}
	// 	})
	getRPCVerifyCode(phone)
		.then(data => {
			// 下发短信验证码失败
			if (data.ret !== 0)
				throw data;
			return setVerifyCode(phone, data.data);
		})
		.then(data => { // 设置验证码成功
			return responseSuccess(res, {}, '');
		})
		.catch(e => {
			console.log('sendVerifyCode error', e);
			if (e.ret) {
				return responseError(res, e.ret, e.msg);
			}
			responseError(res, 51002, 'send verify code error');
		})
	
}

module.exports = sendVerifyCode;
