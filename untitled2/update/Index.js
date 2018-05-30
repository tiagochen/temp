let TestData = require('./TestData')
let Promise = require('bluebird')
let config = require('../config')
var fs = Promise.promisifyAll(require('fs'))


/**
 * 自动更新模块
 * @type {module.Index}
 * @author Chenming
 */
module.exports = class Index {
    constructor(){
        let tasks = [this._loadRemoteVerList(), this._loadLoalVerList()]
        Promise.all(tasks).finally(e => {
            console.log(this._localVerList)
            console.log(this._removeVerList)
        })
    }

    _loadRemoteVerList(){
        return new Promise((resolve, reject) => {
            resolve(TestData.verList)
        }).then(data => this._removeVerList = data)
    }

    _loadLoalVerList(){
        return fs.readFileAsync(`config.verPath/verList.json`)
            .then((data => this._localVerList = data))
            .catch(e => this._localVerList = {})

    }

    _getDiffVerList(){
        let diffList = []
        for( let path in this._removeVerList) {
            let hash = this._removeVerList[path]
            if(this._localVerList[path] !== hash) {
                diffList.push(path)
            }
        }
        return diffList
    }
}