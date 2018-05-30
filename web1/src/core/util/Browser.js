/**
 * 浏览器接口判断
 *
 * @author ChenMing
 */
export default class Browser {
  /**
   * 获取浏览器类型
   *
   * @return Opera, Edge, Firefox, Chrome, Safari, IE, unknow
   */
  static getType() {
    let userAgent = navigator.userAgent
    let isOpera = userAgent.indexOf('Opera') > -1
    if (isOpera) {
      return 'Opera'
    }

    if (userAgent.indexOf('edge') > -1) {
      return 'Edge'
    }

    if (userAgent.indexOf('Firefox') > -1) {
      return 'Firefox'
    }

    if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome'
    }

    if (userAgent.indexOf('Safari') > -1) {
      return 'Safari'
    }

    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      return 'IE'
    }
    // IE 11
    if (userAgent.toLowerCase().indexOf('trident') > -1 && userAgent.indexOf('rv') > -1) {
      return 'IE'
    }
    return 'unknow'
  }

  /**
   * 获取浏览器版本号
   * @notice just for ie & chrome
   */
  static getVersion() {
    let tempArray
    let userAgent = navigator.userAgent

    if (userAgent.toLowerCase().indexOf('trident') > -1 && userAgent.indexOf('rv') > -1) {
      return 11
    }

    if (Browser.getType() === 'IE') {
      let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      return parseFloat(RegExp['$1'])
    }

    if (Browser.getType() === 'Chrome') {
      tempArray = /([Cc]hrome)\/(\d+)/.exec(userAgent)
      return tempArray[2]
    }
    return ''
  }
}
