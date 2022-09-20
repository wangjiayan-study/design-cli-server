const { REDIS_PREFIX } = require('../../config/db');
const { NAME_SPACE, BUILD_DIR } = require('../constants');
const path = require('node:path');
const userhome = require('userhome');
const fse = require('fs-extra');
const simpleGit = require('simple-git');
const userHome = userhome();
class CloudBuildTask {
  constructor(options, ctx, app) {
    const {
      repo,
      projectName,
      branch,
      version,
      buildCmd,
      gitServerType,
      prod,
    } = options;
    this._ctx = ctx;
    this._app = app;
    this.repo = repo;
    this.projectName = projectName;
    this.branch = branch;
    this.version = version;
    this.buildCmd = buildCmd;
    this.getServerType = gitServerType;
    this.prod = prod;
    this._dir = null;
    this._git = null;
    this.success = ctx.helper.success;
    this.fail = ctx.helper.fail;
    // 服务器的用户主目录 + 缓存目录
    // user/.design-cli/cloud
    this._dir = path.resolve(
      userHome,
      NAME_SPACE,
      BUILD_DIR,
      `${this.projectName}${this.version}`
    );
  }
  async prepare() {
    // 获取用户主目录
    // 代码缓存目录
    // 初始化Git,因为后面需要用Git拉代码
    fse.ensureDirSync(this._dir);
    fse.emptyDirSync(this._dir);
    this._git = simpleGit(this._dir);
    return this.success('初始化成功');
  }
  async download() {}
  async build() {}
  async clean() {
    return this.success('清除目录完成');
  }
}
async function createCloudBuildTask(ctx, app) {
  const { socket } = ctx;
  const { id: taskId } = socket;
  const key = `${REDIS_PREFIX}${taskId}`;
  const taskInfo = await app.redis.get(key);

  const { repo, name, branch, version, buildCmd, gitServerType, prod } =
    taskInfo;

  return new CloudBuildTask(
    { repo, name, branch, version, buildCmd, gitServerType, prod },
    ctx,
    app
  );
}

module.exports = {
  CloudBuildTask,
  createCloudBuildTask,
};
