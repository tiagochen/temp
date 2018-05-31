const Log = require('../log')
const Promise = require("bluebird")
const request = Promise.promisifyAll(require('request'))
const fs = Promise.promisifyAll(require('fs'))
const config = require("../config")
const path = require("path")
const FpFs = require("../core/fs/FpFs")

/**
 * 加载远程文件
 * @author ChenMing
 * @type {module.DiffLoader}
 */
module.exports = class DiffLoader {
    loadFiles(fileList) {
        this._clearTempDir(config.updateTempPath)
        return
        Log.succ('开始自动更新: ', Object.keys(fileList).length)
        let promise = Promise.resolve();
        for (let path in fileList) {
            let detail = fileList[path]
            promise = promise.then(() => this._loadFile(path, detail.url))
        }
        promise.then(() => {
            Log.succ('更新文件下载完成')
        }).catch((e) => {
            Log.error('自动更新失败')
        })
    }

    _loadFile(savePath, url) {
        let dir = `${config.updateTempPath}${savePath}`
        return this._makeDirs(path.dirname(dir))
            .then(() => this._getHttpFile(url))
            .then((body) => this._cacheFile(dir, body))
    }

    /**
     * 递归创建目录
     * @param dir
     * @returns {Promise.<T>|*}
     * @private
     */
    _makeDirs(dir) {
        return new Promise((resolve, reject) => {
            return FpFs.mkdirs(dir, (err) => {
                if(err){
                    Log.error('目录创建失败', err)
                    return reject(err)
                }
                return resolve(err)
            })
        })
    }

    _getHttpFile(url) {
        return new Promise((resolve, reject) => {
            Log.succ(`加载远程文件: ${url}`)
            request(url, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    Log.error('远程文件加载失败: ', error, response.statusCode)
                    return reject()
                }
                resolve(body)
            })
        })
    }

    _cacheFile(dir, detail) {
        return fs.writeFileAsync(dir, detail).catch(e => {
            Log.error(`保存文件到目录失败:`, e)
        })
    }

    /**
     * 清空临时目录
     * @private
     */
    _clearTempDir(dirname) {
        // FpFs.rmDirs(dirname)
    }

    /**
     * 从临时目录，将所有文件拷贝到正式代码目录
     * @private
     */
    _revertFiles() {

    }
}