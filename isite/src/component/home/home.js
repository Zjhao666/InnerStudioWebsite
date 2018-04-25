import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import Schedule from './schedule';

const SubMenu = Menu.SubMenu;

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      menu: {
        current: 'plan'
      }
    };
  }
  handleClick(e) {
    this.setState({menu: {current: e.key} });
  }
  render() {
    return <div style = {{width: '100%', height: '100%'}}>
      <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.state.collapsed}
        style = {{
          width: 200,
          height: '100%'
        }}
      >
        <Menu.Item key="1">
          <Icon type="profile" />
          <span>Me</span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="bars" />
          <span>Today</span>
        </Menu.Item>
        <SubMenu key="sub-setting" title={<span><Icon type="setting" /><span>Setting</span></span>}>
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
      </Menu>
      <div style = {{
        position: 'absolute',
        top: 0, left: 200,
        display: 'block',
        padding: 10,
        boxSizing: 'border-box',
        width: 'calc(100% - 200px)',
        height: '100%'
      }}>
        <Schedule />
      </div>
    </div>;
  }
}
