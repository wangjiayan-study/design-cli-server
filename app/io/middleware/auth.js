"use strict";

module.exports = () => {
  return async (ctx, next) => {
    const { app } = this;
    // const { redis } = app;
    // const val = await redis.get("test");
    console.log("val", this);
    await next();
    console.log("disconnect!");
  };
};
