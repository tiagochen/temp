const TestData = require('./TestData')
const Promise = require('bluebird')
const config = require('../config')
const fs = Promise.promisifyAll(require('fs'))

/**
 * 版本对比模块
 * @author Chenming
 * @type {module.DiffVersion}
 */
module.exports = class DiffVersion {
    constructor() {
    }

    /**
     * 生成需要更新的文件列表
     */
    loadDeffer() {
        return new Promise((resolve, reject) => {
            let tasks = [this._loadRemoteVerList(), this._loadLoalVerList()]
            Promise.all(tasks).finally(() => {
                resolve(this._getDiffVerList())
            })
        })
    }

    _loadRemoteVerList() {
        return new Promise((resolve, reject) => {
            resolve(TestData.verList)
        }).then(data => {
            this._remoteVerList = data
        })
    }

    _loadLoalVerList() {
        return fs.readFileAsync(`${config.verPath}/verList.json`)
            .then((data => this._localVerList = data))
            .catch(e => {
                this._localVerList = {}
            })

    }

    _getDiffVerList() {
        let diffList = {}
        for (let path in this._remoteVerList) {
            let remoteConf = this._remoteVerList[path]
            let localConf = this._localVerList[path]
            if (!localConf || localConf.hash !== remoteConf.hash) {
                diffList[path] = remoteConf
            }
        }
        return diffList
    }
}