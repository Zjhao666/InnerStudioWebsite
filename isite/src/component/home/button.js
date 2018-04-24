import React, { Component } from 'react';
import { Icon } from 'antd';

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    }
  }
  onClick() {
    if (this.props.status == null) {
      this.setState({
        clicked: !this.state.clicked
      });
    }
  }
  render() {
    let style = {
      display: 'inline-block',
      width: 75, height: 30,
      textAlign: 'center',
      borderTop: (this.props.status || this.state.clicked) ? '2px solid rgb(130, 160, 140)' : '1px solid rgb(130, 200, 140)',
      borderLeft: (this.props.status || this.state.clicked) ? '2px solid rgb(130, 160, 140)' : '1px solid rgb(130, 200, 140)',
      backgroundColor: (this.props.status || this.state.clicked) ? 'rgb(140, 180, 150)' : 'inherit',
      cursor: 'pointer'
    };
    for(let key in this.props.style) {
      style[key] = this.props.style[key];
    }
    return <div style = { style } onClick = { this.onClick.bind(this) }>
      { this.props.icon && <Icon type = { this.props.icon }/> }
      { this.props.content }
    </div>;
  }
}
