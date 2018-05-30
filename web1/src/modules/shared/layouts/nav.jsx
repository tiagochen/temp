import React, { PropTypes } from 'react'
import { Menu, Icon } from 'fish'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

/**
 * 菜单页面
 * @author ChenMing
 */
class NavMenu extends React.Component {
  static propTypes = {
    routes: PropTypes.array,
    params: PropTypes.object
  }

  handleClick = (conf) => {
    console.log(conf)
    let href = conf.item.props.href
    window.location.href = href
  }

  render() {
    return (
      <Menu onClick={this.handleClick} defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode='inline'>
        <SubMenu key='sub1' title={<span><Icon type='setting' /><span>矿机管理</span></span>}>
          <MenuItemGroup key='g1' title='激活矿机'>
            <Menu.Item key='1' href='#/admin/active'>矿机1</Menu.Item>
            <Menu.Item key='2' href='#/admin/active'>矿机2</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
      </Menu>
    )
  }
}

export default NavMenu
