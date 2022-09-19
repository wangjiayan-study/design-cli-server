"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/project/template", controller.project.getTemplate);

  app.io.route("build", app.io.controller.build.index);
};
