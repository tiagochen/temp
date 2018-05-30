import React from 'react'
import Form from './Form'
import BaseComponents from 'core/components/BaseComponents'

/**
 * 登录页面
 *
 * @author ChenMing
 */
export default class Index extends BaseComponents {
  static propTypes = {
    form: React.PropTypes.any
  }

  constructor(...a) {
    super(...a)
    this.state = {
      getCodeTime: 0
    }
  }

  handleGetCode = (phone) => {
    console.log(phone)
    this.setState({getCodeTime: Math.random()})
  }

  hanleSubmit = (values) => {
    console.log(values)
  }

  render() {
    return (
      <Form onGetCode={this.handleGetCode} getCodeTime={this.state.getCodeTime} onSubmit={this.hanleSubmit} />
    )
  }
}
