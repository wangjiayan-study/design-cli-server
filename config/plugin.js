"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  io: {
    enable: true,
    package: "egg-socket.io",
  },
  redis: {
    enable: true,
    package: "egg-redis",
  },
};
