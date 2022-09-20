'use strict';
const { createCloudBuildTask } = require('../../models/CloudBuildTask');

module.exports = (app) => {
  class Controller extends app.Controller {
    async index() {
      const { ctx, app } = this;
      const { socket, helper } = ctx;
      const { id: taskId } = socket;
      socket.emit(taskId, helper.success('云构建任务链接成功'));
      const buildTask = await createCloudBuildTask(ctx, app);
      try {
        await prepare(buildTask, socket, helper);
        await download(buildTask, socket, helper);
        await install(buildTask, socket, helper);
        await build(buildTask, socket, helper);
      } catch (e) {
        socket.emit(
          'build',
          helper.fail(`云构建失败，捕获失败原因${e.message}`)
        );
        socket.disconnect();
      }
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

async function download(buildTask, socket, helper) {
  const { success } = helper;
  socket.emit('build', success('开始下载代码'));
  await buildTask.download();
  socket.emit('build', success('下载代码完成'));
}
async function install(buildTask, socket, helper) {
  const { success } = helper;
  socket.emit('build', success('开始安装依赖'));
  await buildTask.install();
  socket.emit('build', success('依赖安装成功'));
}
async function build(buildTask, socket, helper) {
  const { success } = helper;
  socket.emit('build', success('开始构建'));
  await buildTask.build();
  socket.emit('build', success('构建成功'));
}
