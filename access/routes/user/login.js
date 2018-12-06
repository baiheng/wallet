const request = require('request-promise');
const uuidv4 = require('uuid/v4');

const { responseError, responseSuccess } = require('../../libs/response');
const redisClient = require('../../libs/redis');
const config = require('../../config');

const REDISVERIFYCODEPREFIX = 'VERIFYCODE:';
const REDISAUTHPREFIX = 'USER:LOGIN:';

const { authValidatePeriod = 5*60 } = config;
const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

/**
 * 判断手机号码是否已经发送过验证码
 * @param  {string} phone 手机号码
 * @return {Promise}       [description]
 */
function getPhoneInVerifying(phone) {
	return new Promise((resolve, reject) => {
		redisClient.get(`${REDISVERIFYCODEPREFIX}${phone}`, (err, result) => {
			if (err || !result) return reject(e || { ret: 51010, msg: '验证码过期或者无效，请重新请求发送验证码'});
			return resolve(result);
		});
	})
}

function setUserInfo(uid, info) {
	return new Promise((resolve, reject) => {
		redisClient.set(`${REDISAUTHPREFIX}${uid}`, JSON.stringify(info), 'EX', authValidatePeriod, (err, result) => {
			if (err) return reject(e);
			resolve('');
		});
	})
}

const login = (req, res, next) => {
	const { phone, code } = req.body;
	if (!phone || !code || !phone.match(phoneReg))
		return responseError(res, 51001, '手机或者验证码错误');

	
	getPhoneInVerifying(phone)
		.then(data => {
			if (data !== code) {

				return responseError(res, 51011, '验证码不正确');
			}
			// 获取用户信息，或者注册新用户
			const sid = uuidv4();
			res.cookie('sid',sid, { maxAge: 900000 });
			responseSuccess(res, { phone });
			setUserInfo(sid, { phone })
		})
		.catch(e => {
			console.log('login error', e);
			if (e.ret) {
				return responseError(res, e.ret, e.msg);
			}
			responseError(res, 51012, 'login error');
		})
	
}

module.exports = login;
