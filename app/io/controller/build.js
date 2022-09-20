'use strict';
const { createCloudBuildTask } = require('../../models/CloudBuildTask');

module.exports = (app) => {
  class Controller extends app.Controller {
    async index() {
      const { ctx, app } = this;
      const { socket, logger, helper, redis } = ctx;
      const { id: taskId } = socket;
      socket.emit(taskId, helper.success('云构建任务链接成功'));
      const buildTask = await createCloudBuildTask(ctx, app);
      await prepare(buildTask, socket, helper);
      // await buildTask.clean();
      // socket.emit(
      //   "build",
      //   parseMsg("download failed", {
      //     message: "源码下载失败",
      //   })
      // );
      // socket.disconnect();
      return;
    }
  }
  return Controller;
};
async function prepare(cloudBuildTask, socket, helper) {
  const { success } = helper;
  socket.emit('build', success('开始准备构建'));
  await cloudBuildTask.prepare();
  socket.emit('build', success('构建准备工作完成'));
}
