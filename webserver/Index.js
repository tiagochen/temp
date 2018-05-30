const express = require("express")
const bodyParser = require("body-parser")
const path = require('path')
const promise = require("bluebird")
let request = require("request")
request = promise.promisifyAll(request)


/**
 * web服务器
 * http://127.0.0.1:8080/index.html
 * @see https://www.cnblogs.com/youlechang123/p/6795485.html
 * @author ChenMing
 */
class WebServer {
    /**
     * 构造
     */
    constructor(host = '127.0.0.1', port = 1111) {
        this._host = host
        this._port = port
        this._app = express()
        this._app.use(bodyParser.urlencoded({extended: false}))
        this._app.use(express.static(path.join(__dirname, '/webapps/')))
        this._register()
    }

    start() {
        this._app.listen(
            this.getPort(),
            this.getHost(),
            () => console.log(`web服务器启动 http://${this.getHost()}:${this.getPort()}`)
        )
    }

    getHost() {
        return this._host
    }

    getPort() {
        return this._port
    }

    _register() {
        this._regHeader()
        this._regGet()
        this._regPost()
    }

    _regHeader() {
        this._app.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
            res.header("X-Powered-By", ' 3.2.1')
            res.header("Content-Type", "application/json;charset=utf-8")
            next()
        })
    }

    _regGet() {
        this._app.get("/api/v1.0/", function (req, res) {
            console.log("get1 请求url：", req.path)
            console.log("请求参数：", req.query)
            setTimeout(() => res.send("这是get请求"), 1000)
        })
    }

    _regPost() {
        this._app.post("/post", function (req, res) {
            console.log("请求参数：", req.body)
            let result = {code: 200, msg: "post请求成功"}
            res.send(result)
        })
    }

    _loadAgent(apiUrl, agentUrl = '/agent/') {
        let options = {
            url: agentUrl,
            method: 'POST',
            json: true,
            headers: {"content-type": "application/json",},
            body: JSON.stringify({url: apiUrl})
        }
        let res = request.postAsync(options)
        //返回代执行的promise函数
        return res.spread(function (res, body) {
            return body
        })
    }
}

let server = new WebServer()
server.start()