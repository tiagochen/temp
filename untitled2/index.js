const Log = require('./core/log')
const DiffVersion = require('./update/DiffVersion')
const DiffLoader = require('./update/DiffLoader')

Log.succ('程序启动')


let diffVer = new DiffVersion()
let diffLoader = new DiffLoader()

diffVer.loadDeffer().then(diffList => {
    return diffLoader.loadFiles(diffList)
}).then(() => {
    diffLoader.restoreFiles()
})


Log.succ('程序退出')

