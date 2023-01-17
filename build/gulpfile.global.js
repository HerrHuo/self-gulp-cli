const SRC_DIR = './src/';                     // 源文件目录
const DIST_DIR = './dist/';                   // 文件处理后存放的目录

const config = {
    src: SRC_DIR,
    dist: DIST_DIR,
    html: {
        src: [
            `${SRC_DIR}**/*.html`,
            `!${SRC_DIR}**/modules/*.html`
        ],
        dist: DIST_DIR
    },
    scss: {
        src: [
            `${SRC_DIR}**/*.scss`,
            `!${SRC_DIR}**/modules/*.scss`
        ],
        dist: DIST_DIR
    },
    js: {
        src: [
            `${SRC_DIR}**/*.js`,
            `!${SRC_DIR}**/modules/*.js`
        ],
        dist: DIST_DIR
    },
    img: {
        src: [
            `${SRC_DIR}img/**/*.*`
        ],
        dist: `${DIST_DIR}/img/`
    }
};

module.exports = config;
