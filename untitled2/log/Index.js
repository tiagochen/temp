const config = require('../config')
const fs = require('fs')

/**
 * 记录日志的类
 * @author ChenMing
 * @type {module.Index}
 */
module.exports = class Index {
    /**
     * 记录成功日志
     * @param a console.log的参数
     */
    static succ(...a) {
        fs.appendFile(
            Index._getFileName(),
            Index._formatLog('succ', ...a),
            (err) => {  err && console.log('日志记录失败', err) });
        console.log(...a)
    }

    static error(...a) {
        fs.appendFile(
            Index._getFileName(),
            Index._formatLog('error', ...a),
            (err) => {  err && console.log('日志记录失败', err) });
        console.error(...a)
    }

    static _getFileName() {
        let t = new Date()
        return `${config.logPath}/log_${t.getFullYear()}_${t.getMonth() + 1}_${t.getDate()}.txt`
    }

    static _formatLog(type, ...a) {
        let t = new Date()
        return `[${type}] ${t.getMonth() + 1}-${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()} : ${a.toString()}\n`
    }
}