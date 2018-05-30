import FetchUtil from './FetchUtil'

/**
 * 枚举值加载器，具体应用，通过这个接口，得到想要的枚举值
 *
 * @author ChenMing
 */
export default class EnumLoader {
  static _enumItemList = {}

  static load(url, cb, arg = {}) {
    let enumItem = EnumLoader._enumItemList[url]
    if (!enumItem) {
      enumItem = new EnumItem(url)
      EnumLoader._enumItemList[url] = enumItem
    }
    enumItem.addCb(cb, arg)
  }

  static unload(url) {
    EnumLoader._enumItemList[url] = null
  }
}

/**
 * 加载对象
 *
 * @author ChenMing
 */
class EnumItem {
  static STATE_NULL = 0
  static STATE_LOADING = 1
  static STATE_READY = 2

  constructor(url) {
    this.url = url
    this.data = []
    this.cbList = []
    this.state = EnumItem.STATE_NULL
  }

  /**
   * 添加回调，这个函数会自动触发网络加载
   */
  addCb(cb, arg = {}) {
    if (this.state === EnumItem.STATE_READY) {
      this._callCb(cb, arg)
      return
    }
    this.cbList.push({cb, arg})
    if (this.state === EnumItem.STATE_NULL) {
      this._startLoad()
    }
  }

  _startLoad() {
    this.state = EnumItem.STATE_LOADING
    new FetchUtil().request([], this.url).then(data => {
      this.data = data
      this.state = EnumItem.STATE_READY
      this.cbList.forEach(config => {
        this._callCb(config.cb, config.arg)
      })
      this.cbList = []
    })
  }

  /**
   * 调用回调
   * @private
   */
  _callCb(cb, arg) {
    cb(this.data, ...arg, this.url)
  }
}
