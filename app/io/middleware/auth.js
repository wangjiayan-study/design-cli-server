'use strict';
const { REDIS_PREFIX } = require('../../../config/db');
// const { createCloudBuildTask } = require('../../models/CloudBuildTask');

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket } = ctx;
    const { redis, logger } = app;
    const query = socket.handshake.query;
    logger.info('query', query);
    const { id: taskId } = socket;
    const key = `${REDIS_PREFIX}${taskId}`;
    const val = await redis.get(key);
    // 判断redis任务是否存在
    if (!val) {
      await redis.set(key, JSON.stringify(query));
      logger.info('写入redis', key);
    }
    await redis.get(key);
    await next();
    // const buildTask = await createCloudBuildTask(ctx, app);
    // await buildTask.clean();
    console.log('disconnect!');
  };
};
