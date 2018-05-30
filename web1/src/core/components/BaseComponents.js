import { Component } from 'react'

/**
 * 提供所有组件的基类，用于封装基础实现
 */
class BaseComponents extends Component {
  // 实例化数量，用于子类被多次实例化时的标识
  static instCount = 0
  static propTypes = {
  }

  /**
   * 构造函数
   */
  constructor(props, context) {
    super(props, context)
    this.instCount = BaseComponents.instCount++
  }

  /**
   * 快速获取语言包的内容
   *
   * @param id zh.js 中定义的内容
   */
  i18n(id) {
    if (!window.i18n) {
      return id
    }
    return window.i18n(id)
  }
}

export default BaseComponents
