'use strict';

const Controller = require('egg').Controller;
const Project = require('../db/models/Project');
const { SuccessModel } = require('../models/resModel');

class ProjectController extends Controller {
  // 获取项目/组件的代码模板
  async getTemplate() {
    const { ctx } = this;
    const data = await Project.find();
    ctx.body = new SuccessModel(data);
  }
}

module.exports = ProjectController;
