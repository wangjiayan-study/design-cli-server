const { REDIS_PREFIX } = require('../../config/db');
const { NAME_SPACE, BUILD_DIR } = require('../constants');
const path = require('node:path');
const userhome = require('userhome');
const fse = require('fs-extra');
const fs = require('node:fs');
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
    this.logger = app.logger;
    this.logger.info('options', options);
    // 服务器的用户主目录 + 缓存目录
    // user/.design-cli/cloud
    this._dir = path.resolve(
      userHome,
      NAME_SPACE,
      BUILD_DIR,
      `${this.projectName}@${this.version}`
    );
    this._sourceCodeDir = path.resolve(this._dir, this.projectName); // 缓存源码目录
  }
  async prepare() {
    // 获取用户主目录
    // 代码缓存目录
    // 初始化Git,因为后面需要用Git拉代码
    fse.ensureDirSync(this._dir);
    // 会把当前代码缓存目录的代码删掉
    fse.emptyDirSync(this._dir);
    this._git = simpleGit(this._dir);
    this.logger.info('git目录', this._dir);
    return this.success('初始化成功');
  }
  async download() {
    // git clone仓库代码
    // 切到开发分支
    this.logger.info('git repo path', this.repo);
    await this._git.clone(this.repo); // clone仓库
    // 这里克隆下来之后，会在this._dit生成projectName的目录。
    // 所以应该改变下git的目录
    this.logger.info('_sourceCodeDir', this._sourceCodeDir);
    this._git = simpleGit(this._sourceCodeDir);
    await this._git.checkout(['-b', this.branch, `origin/${this.branch}`]);
    return fs.existsSync(this._sourceCodeDir)
      ? this.success('源码下载成功')
      : this.fail('源码下载失败');
  }

  async install() {
    const res = await this.execCmd(
      'npm install --registry=https://registry.npm.taobao.org'
    );
    return res ? this.success() : this.fail();
  }

  async build() {
    let res = true;
    if (checkCommand(this._buildCmd)) {
      res = await this.execCmd(this._buildCmd);
    } else {
      res = false;
    }
    return res ? this.success() : this.fail();
  }

  async clean() {
    return this.success('清除目录完成');
  }
  execCmd(cmd) {
    // npm install ->['npm','install']
    const command = cmd.split(' ');
    if (command.length === 0) {
      return null;
    }
    const firstCommand = command[0];
    const leftCommand = command.slice(1) || [];
    return new Promise((resolve) => {
      const p = exec(
        firstCommand,
        leftCommand,
        {
          cwd: this._sourceCodeDir,
        },
        { stdio: 'pipe' }
      );
      p.on('error', (e) => {
        this._ctx.logger.error('build error', e);
        resolve(fasle);
      });
      p.on('exit', (c) => {
        this._ctx.logger.info('build exit', c);
        resolve(true);
      });
      p.stdout.on('data', (data) => {
        this._ctx.socket.emit('building', data.toString());
      });
      p.stderr.on('data', (data) => {
        this._ctx.socket.emit('building', data.toString());
      });
    });
  }
}
async function createCloudBuildTask(ctx, app) {
  const { socket } = ctx;
  const { id: taskId } = socket;
  const key = `${REDIS_PREFIX}${taskId}`;

  const taskInfo = await app.redis.get(key);
  const { repo, projectName, branch, version, buildCmd, gitServerType, prod } =
    JSON.parse(taskInfo);

  return new CloudBuildTask(
    { repo, projectName, branch, version, buildCmd, gitServerType, prod },
    ctx,
    app
  );
}
function checkCommand(command) {
  if (command) {
    const commands = command.split(' ');
    if (commands.length === 0 || ['npm', 'cnpm'].indexOf(commands[0]) < 0) {
      return false;
    }
    return true;
  }
  return false;
}
function exec(command, args, options) {
  const win32 = process.platform === 'win32';
  const cmd = win32 ? 'cmd' : command;
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
  return require('child_process').spawn(cmd, cmdArgs, options || {});
}

module.exports = {
  CloudBuildTask,
  createCloudBuildTask,
};
