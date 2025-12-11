const IORedis = require('ioredis');
const logger = require('../utils/logger');


let redisClient;


function initRedis(redisUrl) {
if (redisClient) return redisClient;
redisClient = new IORedis(redisUrl);
redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('error', (e) => logger.error('Redis error', e));
return redisClient;
}


module.exports = { initRedis };