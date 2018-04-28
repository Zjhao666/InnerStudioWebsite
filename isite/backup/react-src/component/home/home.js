import React, { Component } from 'react';
import { Menu, Icon, Button } from 'antd';
import 'antd/dist/antd.css';
// import Chatbox from './chatbox';
import Schedule from './schedule';
import Profile from './profile';

import request from 'request';
import User from '../../model/user';

const SubMenu = Menu.SubMenu;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
      collapsed: true,
      current: null,
      teams: []
    };
    this.user = null;
    request('http://127.0.0.1:8080/user/validate?name=' + 'lijingwei' + '&password=' + '123456', (err, rep, body) => {
      console.log(body)
      rep = JSON.parse(body);
      this.user = new User(rep.data.id, rep.data.pass, this.onTeamInfoLoaded.bind(this), this.onTeamHistoryLoaded.bind(this));
    });
    this.show();
  }
  show() {
    let x = 0;
    let timer = setInterval(() => {
      x += 2;
      if (x >= 100) clearInterval(timer);
      this.setState({opacity: '' + x / 100});
    }, 20);
  }
  handleClick(e) {
    if (e.key == 'mi-1') this.setState({ collapsed: !this.state.collapsed });
    else if (e.key.startsWith('cb-')) {
      /*
      let teamId = parseInt(e.subtring(3));
      // join team
      this.setState({
        menuItemSelected:
        <Chatbox
          name = { user.getName() }
          onSend = { user.send.bind(user) }
          onRecv = { user.onRecv.bind(user) } />
      });
      */
    }
  }
  onTeamInfoLoaded(data) {
    console.log(data);
  }
  onTeamHistoryLoaded(data) {
    console.log(data);
  }
  render() {
    return <div style = {{width: '100%', height: '100%', opacity: this.state.opacity}}>
      <Menu
        mode="inline"
        theme="dark"
        onClick = { this.handleClick.bind(this) }
        inlineCollapsed = { this.state.collapsed }
        style = {{
          verticalAlign: 'top',
          display: 'inline-block',
          maxWidth: 200,
          height: '100%'
        }}>
        <Menu.Item key="mi-1">
          <Icon type = { this.state.collapsed ? 'menu-unfold' : 'menu-fold' } />
          <span>Collapse</span>
        </Menu.Item>
        <SubMenu key="chat-box" title={<span><Icon type="message" /><span>Chat</span></span>}>
          <Menu.Item key="cb-1">
            <Icon type="team" />
            <span>Team 1</span>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="mi-2">
          <Icon type="bars" />
          <span>Today</span>
        </Menu.Item>
      </Menu>
      <div style = {{
        verticalAlign: 'top',
        display: 'inline-block',
        boxSizing: 'border-box',
        width: 'calc(100% - ' + (this.state.collapsed ? '80': '200') + 'px)',
        height: '100%'
      }}>
        { this.state.current }
      </div>
    </div>;
  }
}
