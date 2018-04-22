const redis = require("redis");

const config = require('../config');
const redisConfig = config.redis || {};

const client = redis.createClient(redisConfig.port || '6379', redisConfig.host || '127.0.0.1');

module.exports = client;