import $ from 'jquery'
import fetch from 'isomorphic-fetch'
import {UserToken} from '@sdp.nd/nd-uc-token'
import UC from '../util/uc/UC'
import i18n from '../util/i18n'
import config from 'config'
import {uuid} from 'core/util/StringUtil'
import {message} from 'fish'

/**
 * 服务端通讯类
 * @author ChenMing
 *
 * @example
 *   不经过redux的GET请求
 *   new FetchUtil().request(null, 'http://diyform-gateway.dev.web.nd/list', {method:'GET'} )
 *   不经过redux的POST请求
 *   new FetchUtil().request(null, 'http://diyform-gateway.dev.web.nd/list', {method:'POST', body:{page:1}} )
 */
export default class FetchUtil {
  /**
   * 接口报错时的钩子
   * 默认情况下，如果有报错，
   */
  static errorHook = [
    (body, response) => {
      if (!window.Alert) {
        return
      }
      if (response.status === 403) {
        window.Alert.show(window.Alert.TYPE_ERROR_AUTH, window.i18n('提示'), body.message || body.detail)
      } else if (response.status === 404) {
        // window.Alert.show(window.Alert.TYPE_ERROR_NETWORK, window.i18n('提示'), `接口不存在：${response.url}`)
        window.Alert.show(window.Alert.TYPE_ERROR_NETWORK, window.i18n('提示'), body.message || body.detail)
      } else {
        window.Alert.show(window.Alert.TYPE_ERROR_COMMON, window.i18n('提示'), body.message || body.detail)
      }
    }
  ]

  static waiting = 0 // 当前正在加载的请求数
  static messageHandle = null // 提示框句柄
  static timeoutHandle = null // 时间句柄

  /**
   * 代理请求服务器
   * 在101教育平台中，通常表示通过网关服务器代理到其他服务器的请求
   * 这种方式通常用来解决客户端的跨区以及服务端业务划分的问题
   *
   * @param types 需要用户认证的代理方法，如果不经过redux，将types置空
   * @param url 请求地址
   * @param para {method : 请求方法，默认GET, body : POST 的请求体}
   * @return {*} fetch
   */
  request(types, serverUrl, para = {}) {
    return this.requestWithNoAgent(types, serverUrl, para)
  }

  /**
   * 直接请求服务器
   * 在101教育平台中，通常表示请求网关服务器：gateway
   *
   * @param types 需要用户认证的代理方法，如果不经过redux，将types置空
   * @param url 请求地址
   * @param para {method : 请求方法，默认GET, body : POST 的请求体}
   * @return {*} fetch
   */
  requestWithNoAgent(types, url, para = {}) {
    url = this._encodeUrl(url)
    let method = para.method || 'GET'
    let obj = {url, method, headers: this._createHeader(url, method)}
    if (method !== 'GET') {
      obj.body = JSON.stringify(para.body || '')
    }
    if (types && types.length >= 0) {
      obj.types = types
    }
    return this._fetchWrapper(url, obj)
  }

  /**
   * 代理请求服务器
   * 在101教育平台中，通常表示通过网关服务器代理到其他服务器的请求
   * 这种方式通常用来解决客户端的跨区以及服务端业务划分的问题
   *
   * @param types 需要用户认证的代理方法，如果不经过redux，将types置空
   * @param url 请求地址
   * @param para {method : 请求方法，默认GET, body : POST 的请求体}
   * @return {*} fetch
   */
  requestWithAgent(types, serverUrl, para = {}) {
    serverUrl = this._encodeUrl(serverUrl)
    let gatewayUrl = config.gateway + '/v1/apiagent'
    let gatewayMethod = 'POST'
    let gatewayHeader = this._createHeader(gatewayUrl, gatewayMethod)

    let serverMethod = para.method || 'GET'
    let serverHeader = this._createHeader(serverUrl, serverMethod)
    serverHeader.Accept = config.sdpHeader
    serverHeader = Object.keys(serverHeader).map(key => {
      return {name: key, value: serverHeader[key]}
    })

    let obj = {
      url: gatewayUrl,
      method: gatewayMethod,
      headers: gatewayHeader,
      body: JSON.stringify({
        uri: serverUrl,
        method: serverMethod,
        header: serverHeader,
        body: para.body || {}
      })
    }

    if (types && types.length >= 0) {
      obj.types = types
    }
    return this._fetchWrapper(gatewayUrl, obj)
  }

  _encodeUrl(url) {
    // 在对接的时候，发现传递 http://www.k.com?name=1&key=&
    // 这个时候&无法识别到底是参数，还是key的值，所以外部如果传递值，那么请使用 UrlSearch.margeQueryString 进行编码
    // let a = document.createElement('a')
    // a.href = url
    // let host = `${a.protocol}//${a.hostname}`
    // let uri = url.substring(host.length)
    // url = host + encodeURI(uri)
    // url = url.replace(/#/ig, encodeURIComponent('#'))

    let code = uuid() + Math.random()
    if (url.indexOf('?') === -1) {
      return `${url}?_k=${code}`
    }
    return `${url}&_k=${code}`
  }

  /**
   * 生产fetch请求的头部
   */
  _createHeader(url, method) {
    if (!window.projectDomain) {
      console.log(`[Service] 无法获取工程名称，请确认是否调用了UC.init`)
    }
    let Authorization = ''
    // window.JsMAF 来自UC的单点登录函数，src="//cdncs.101.com/v0.1/static/uc_cdn/ucManager.min.v0.11.js"
    // 如果 user_id 为空，表示发送未登录的请求
    if (window.JsMAF) {
      UC.getUserInfo().user_id && (Authorization = `User user_id="${UC.getUserInfo().user_id}",${window.JsMAF.getAuthHeader(url, method)}`)
    } else {
      Authorization = UserToken.getAuthorization(url, method)
    }
    return {
      'X-Gaea-Authorization': 'GAEA id=' + $.cookie(`Gaea_id_${window.projectDomain}`),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': i18n.getInst().getCode(),
      'Authorization': Authorization,
      'Cache-Control': 'no-cache'
    }
  }

  /**
   * 对fetch的封装，返回promise
   */
  _fetchWrapper(url, opt) {
    FetchUtil.waiting++
    !FetchUtil.timeoutHandle && (FetchUtil.timeoutHandle = setTimeout(() => {
      FetchUtil.messageHandle && FetchUtil.messageHandle()
      FetchUtil.messageHandle = message.loading(window.i18n('加载中...'), 0)
    }, 1000))
    // 发送cookie给服务端
    opt.credentials = 'same-origin'
    return fetch(url, opt).then(response => {
      if (--FetchUtil.waiting <= 0) {
        FetchUtil.timeoutHandle && clearTimeout(FetchUtil.timeoutHandle)
        FetchUtil.messageHandle && FetchUtil.messageHandle()
        FetchUtil.timeoutHandle = null
        FetchUtil.messageHandle = null
      }
      if (response.status === 200) {
        let json = response.json()
        return json.then(json => {
          return {json, response}
        }).then(({json, response}) => {
          if (!response.ok) {
            return Promise.reject(json)
          }
          return json
        }).catch(e => {
          if (response.ok) {
            return {}
          } else {
            return Promise.reject(e)
          }
        })
      } else {
        let json = response.json()
        return json.then(json => {
          FetchUtil.errorHook.forEach(hook => {
            hook(json, response, url, opt)
          })
          return Promise.reject(json)
        })
        // let json = response.json()
        // return json.catch(e => { return Promise.reject(e) })
        // return Promise.reject(response)
      }
    })
  }
}
