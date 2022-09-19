"use strict";

module.exports = (app) => {
  class Controller extends app.Controller {
    async index() {
      const { ctx, app } = this;
      const { socket, logger, helper, redis } = ctx;
      const { parseMsg } = helper;
      const { id } = socket;
      const val = await app.redis.get("test");
      console.log("val", val);
      // const query = socket.handshake.query;
      const query = {
        repo: "https://github.com/wangjiayan/testapp.git",
        name: "undefined",
        branch: "null",
        version: "1.0.0",
        buildCmd: "undefined",
        gitServerType: "github",
        prod: "true",
      };

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
