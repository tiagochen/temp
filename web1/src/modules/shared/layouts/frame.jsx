import React from 'react'
import Browser from 'util/Browser'
import NavMenu from './nav'

class Frame extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    routes: React.PropTypes.array,
    params: React.PropTypes.object,
    children: React.PropTypes.element
  }

  constructor(...a) {
    super(...a)
    this.state = {initing: true}
  }

  componentDidMount() {
    if (Browser.getType() === 'Chrome') {
      let log = console.log
      console.log = (...a) => log(`【${window.document.title}】`, ...a)
    }
    console.log('当前页面', window.location.href)
    this.setState({initing: false})
  }

  render() {
    if (this.state.initing) {
      return null
    }
    return (
      <div className='menu-layout-wrapper'>
        <div className='menu-layout-left'>
          <NavMenu params={this.props.params} routes={this.props.routes} />
        </div>
        <div className='menu-layout-content'>
          <div className='menu-layout-body'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Frame
