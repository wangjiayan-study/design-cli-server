// 对应 project 集合

const mongoose = require('../db');

const ProjectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    version: String,
  },
  { timestamps: true }
);

const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;
