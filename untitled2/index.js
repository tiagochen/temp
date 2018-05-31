const Log = require('./log')
const DiffVersion = require('./update/DiffVersion')
const DiffLoader = require('./update/DiffLoader')

Log.succ('程序启动')




let diffVer = new DiffVersion()
diffVer.loadDeffer().then(diffList => {
    let diffLoader = new DiffLoader()
    diffLoader.loadFiles(diffList)
})



