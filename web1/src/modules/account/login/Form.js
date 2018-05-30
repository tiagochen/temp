import React from 'react'
import { Form, Input, Button, Row, Col } from 'fish'
import BaseComponents from 'core/components/BaseComponents'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 14}
  }
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
}

/**
 * 登录页面
 *
 * @author ChenMing
 */
class LoginForm extends BaseComponents {
  static propTypes = {
    onSubmit: React.PropTypes.func,
    onGetCode: React.PropTypes.func,
    getCodeTime: React.PropTypes.number,
    form: React.PropTypes.any
  }

  constructor(...a) {
    super(...a)
    this.state = {
      lastGetCodeTime: 0
    }
    this.getCodeInterval = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.getCodeTime !== this.props.getCodeTime) {
      this.setState({lastGetCodeTime: 30})
      this.clearGetCodeInterval()
      this.getCodeInterval = setInterval(() => {
        --this.state.lastGetCodeTime
        if (!this.state.lastGetCodeTime) {
          this.clearGetCodeInterval()
        }
        this.setState({lastGetCodeTime: this.state.lastGetCodeTime})
      }, 1000)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit && this.props.onSubmit(values)
      }
    })
  }

  hanleCetCode = () => {
    if (this.state.lastGetCodeTime) {
      return
    }
    this.props.form.validateFields(
      ['phone'],
      {force: true},
      (err, values) => {
        if (!err && this.props.onGetCode) {
          this.props.onGetCode(values.phone)
        }
      }
    )
  }

  clearGetCodeInterval = () => {
    this.getCodeInterval && clearInterval(this.getCodeInterval)
    this.getCodeInterval = null
  }

  checkPhone = (rule, value, callback) => {
    if (value && parseInt(value).toString() !== value) {
      callback('手机号必须是数字')
      return
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div style={{width: '650px'}}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label='手机号'>
            <Row gutter={8}>
              <Col span={14}>
                {getFieldDecorator('phone', {
                  rules: [
                    { required: true, message: '请输入正确手机号！' },
                    { len: 11, message: '手机号长度必须是11位!' },
                    { validator: this.checkPhone }
                  ]
                })(
                  <Input size='large' maxLength={11} />
                )}
              </Col>
              <Col span={10}>
                <Button size='large' onClick={this.hanleCetCode}>
                  {this.state.lastGetCodeTime ? `获取验证码（${this.state.lastGetCodeTime}）` : `获取验证码`}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label='验证码'>
            {getFieldDecorator('code', {
              rules: [
                { required: true, message: '请输入正确验证码!' },
                { len: 4, message: '验证码长度为4位!' }
              ]
            })(
              <Input size='large' maxLength={4} />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit' size='large'>登录</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(LoginForm)
