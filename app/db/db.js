const mongoose = require('mongoose');
const { mongodbUrl, mongodbDbName } = require('../../config/db');

mongoose.connect(`${mongodbUrl}/${mongodbDbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// 发生错误
db.on('error', (err) => {
  console.error(err);
});

// 连接成功
db.once('open', () => {
  console.log('mongoose connect success…');
});

module.exports = mongoose;
