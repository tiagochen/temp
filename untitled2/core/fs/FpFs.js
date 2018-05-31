const Promise = require("bluebird")
const fs = Promise.promisifyAll(require('fs'))
// https://www.npmjs.com/package/rd
const rd = require('rd')
const path = require("path")
const stat = fs.stat

module.exports = class FpFs {
    /**
     * 递归创建文件夹
     * @param dirname 目录
     * @param callback 回调函数，如果失败，参数是 error，否则为空
     */
    static mkdirsAsync(dirname, callback) {
        if (fs.existsSync(dirname)) {
            callback()
        } else {
            FpFs.mkdirsAsync(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback)
            })
        }
    }

    /**
     * 递归创建文件夹
     * @param dirname 目录
     * @param callback 回调函数，如果失败，参数是 error，否则为空
     */
    static mkdirs(dirname) {
        if (fs.existsSync(dirname)) {
            return true
        } else {
            FpFs.mkdirs(path.dirname(dirname))
            fs.mkdirSync(dirname)
        }
    }

    /**
     * 递归删除文件夹
     * @param dirname 目录
     */
    static rmdirs(dirname) {
        if (fs.existsSync(dirname)) {
            fs.readdirSync(dirname).forEach((file) => {
                let curPath = dirname + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    FpFs.rmdirs(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirname);
        }
    }

    /**
     * 目录拷贝
     * @param src
     * @param dst
     */
    static copyDirs(src, dst, callback) {
        rd.eachSync(src, function (f, s) {
            if (s.isDirectory()) {
                return
            }
            let fromFileName = path.parse(f).base
            let fromDir = path.parse(f).dir
            FpFs.mkdirs(dst)
            FpFs.writeFile(f, `${dst}/${fromFileName}`)
        })
    }

    static removeFille(filePath) {
        if( fs.existsSync(filePath) ){
            fs.unlinkSync(filePath)
        }
    }

    static writeFile(fromPath, toPath) {
        FpFs.removeFille(toPath)
        fs.writeFileSync(toPath, fs.readFileSync(fromPath))
    }
}