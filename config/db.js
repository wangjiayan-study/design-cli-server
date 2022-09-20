'use strict';
const REDIS_PREFIX = 'cloud_build';
/** MONGODB **/
const mongodbUrl = 'mongodb://localhost:27017';
const mongodbDbName = 'design-low-code';

module.exports = {
  mongodbUrl,
  mongodbDbName,
  REDIS_PREFIX,
};
