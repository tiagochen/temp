import {parseQueryString} from './UrlSearch'

/**
 * 对Post Message的封装
 * 实现iframe中的相互通信
 *
 * @author ChenMing
 */
export default class PostMsg {
  static listenerList

  /**
   * 监听消息并触发回调
   *
   * @param cb 收到事件后的回调函数
   * @param action 希望监听的事件名称
   */
  static addEventListener(cb, action) {
    if (!PostMsg.listenerList) {
      PostMsg.listenerList = []
      if (window.addEventListener) { // 所有主流浏览器，除了IE8及更早IE版本
        window.addEventListener('message', (e) => PostMsg.onRecvEvent(e), false)
      } else if (window.attachEvent) { // IE 8
        window.attachEvent('onmessage', (e) => PostMsg.onRecvEvent(e))
      }
    }
    PostMsg.listenerList.push({cb, action})
  }

  /**
   * 发送消息
   * @param data
   */
  static sendMessage(data) {
    console.log('[PostMsg::sendMessage]:', data)
    data['__biz_code'] = data.__biz_code || parseQueryString(window.location.hash)['__biz_code']
    // // 表示发送给当前组件嵌入的iframe
    // if (data.__biz_code && window.frames[data.__biz_code]) {
    //   window.frames[data.__biz_code].postMessage(JSON.stringify(data), '*')
    // }
    for (let i = 0; i < window.frames.length; ++i) {
      let child = window.frames[i]
      child.postMessage(JSON.stringify(data), '*')
    }
    window.postMessage(JSON.stringify(data), '*')
    window.parent !== window && window.parent.postMessage(JSON.stringify(data), '*')
  }

  static onRecvEvent(event) {
    let filterData = (event.data || '').toString()
    if (filterData.indexOf('IFRAME') === -1 && event.source !== window) {
      console.log('[PostMsg:recvMessage]:', event)
    }
    if (typeof (event.data) !== 'string') {
      return
    }
    if (!event.data) {
      return
    }
    let data = {}
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      return
    }
    let bizCode = parseQueryString(window.location.hash)['__biz_code']
    let handleCb = () => {
      PostMsg.listenerList.forEach(config => {
        if (config.action && config.action !== data.action) {
          return
        }
        (typeof (config.cb) === 'function') && config.cb(data)
      })
    }
    if (data['__biz_code']) {
      bizCode && data['__biz_code'] === bizCode && handleCb()
    } else {
      handleCb()
    }
  }
}
