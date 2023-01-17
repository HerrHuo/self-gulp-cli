// 开发环境
const dev = require('./build/gulpfile.dev.js');
dev();
// 生产环境
const prod = require('./build/gulpfile.prod.js');
prod();
