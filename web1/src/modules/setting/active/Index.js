import React from 'react'
import BaseComponents from 'core/components/BaseComponents'
import {Button} from 'fish'

/**
 * 矿机激活页面
 *
 * @author ChenMing
 */
export default class Index extends BaseComponents {
  static propTypes = {
  }

  constructor(...a) {
    super(...a)
    this.state = {
      getCodeTime: 0
    }
  }

  handleActive = () => {

  }

  render() {
    return (
      <div>
        <Button onClick={this.handleActive} size='large'>激活矿机{Math.random()}</Button>
      </div>
    )
  }
}
