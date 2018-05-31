const Promise = require("bluebird")
const fs = Promise.promisifyAll(require('fs'))
const path = require("path")

module.exports = class FpFs {
    /**
     * 递归创建文件夹
     * @param dirname 目录
     * @param callback 回调函数，如果失败，参数是 error，否则为空
     */
    static mkdirs(dirname, callback) {
        if (fs.existsSync(dirname)) {
            callback()
        } else {
            FpFs.mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback)
            })
        }
    }

    /**
     * 递归删除文件夹
     * @param dirname 目录
     */
    static rmDirs(dirname) {
        if (fs.existsSync(dirname)) {
            fs.readdirSync(dirname).forEach((file) => {
                let curPath = dirname + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    FpFs.rmDirs(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirname);
        }
    }
}