/**
 * 语言包模块
 * @author ChenMing
 */
import $ from 'jquery'
import FetchUtil from '../net/FetchUtil'
import config from 'config'
import Promise from 'bluebird'

const commonName = 'team7-js'
export default class I18n {
  static _inst = null
  static _init = false

  /**
   * 获取单例对象
   * @return {I18n}
   */
  static getInst() {
    I18n._inst = I18n._inst || new I18n()
    return this._inst
  }

  /**
   * 构造
   */
  constructor() {
    window.i18n = (...arg) => this.getText(...arg)
  }
  /**
   * 判断是否初始化完成
   * @returns {boolean} true：成功，false：失败
   */
  hasInited() {
    return I18n._init
  }

  /**
   * 初始化
   * @param langList 所有语言包
   * @param readyCb 初始化完成后的回调函数
   */
  init() {
    return new Promise((resolve, reject) => {
      if (this.hasInited()) {
        return resolve()
      }
      I18n._init = true
      this._readyCb = resolve
      this._curLang = {}
      this._zhCnLang = {}
      this._loadEnv()
    })
  }

  /**
   * 根据中文，获取到对应的英文
   * @param zhText 中文内容
   */
  getText(zhText, lanKey) {
    if (this._curLang === this._zhCnLang) {
      return zhText
    }
    let key = lanKey || this.getKey(zhText)
    if (!key || !this._curLang[key]) {
      return zhText
    }
    return this._curLang[key]
  }

  /**
   * 从中文语言包中，获取text的key
   */
  getKey(zhText) {
    if (!this._zhCnLang) {
      console.log('【i18n】 无法翻译中文，找不到中文语言包')
      return
    }
    for (let key in this._zhCnLang) {
      if (this._zhCnLang[key] === zhText) {
        return key
      }
    }
  }

  /**
   * 获取当前的语种
   */
  getCode() {
    return $.cookie('__lang')
  }

  /**
   * 获取语言包的信息
   */
  getLangPack(lang, name, ver) {
    name = name || config.appName
    ver = ver || config.appLangKey
    return new FetchUtil().requestWithNoAgent(
      null,
      `${config.gateway}${config.appFactorTranslateApi}/v0.1/bizs/versions/0/com.nd.sdp.web/${name}/browser/web/${ver}/${lang}`
    )
  }

  /**
   * 获取语言包地址
   */
  getLangPackInfo(folderUrl) {
    let host = folderUrl.split('//')[1].split('/')[0]
    let retUrl = folderUrl.split(host)[1]
    return new FetchUtil().requestWithNoAgent(
      null,
      config.gateway + config.appLangApi + retUrl + '/i18n.json'
    )
  }
  /**
   * 获取当前语言环境
   * @private
   */
  _loadEnv() {
    Promise.all([this.getLangPack(config.cnPack), this.getLangPack($.cookie('__lang')), this.getLangPack(config.cnPack, commonName, config.appLangCommonKey), this.getLangPack($.cookie('__lang'), commonName, config.appLangCommonKey)]).then((ret) => {
      Promise.all([this.getLangPackInfo(ret[0].folder_url), this.getLangPackInfo(ret[1].folder_url), this.getLangPackInfo(ret[2].folder_url), this.getLangPackInfo(ret[3].folder_url)]).then((retInfo) => {
        this._zhCnLang = {...retInfo[0], ...retInfo[2]}
        this._curLang = {...retInfo[1], ...retInfo[3]}
        this._readyCb()
        console.log('【i18n】语言包初始化完成', this._curLang, this._zhCnLang)
      }).catch((e) => { console.log('【i18n】语言包请求有误：', e) })
    })
  }
}
