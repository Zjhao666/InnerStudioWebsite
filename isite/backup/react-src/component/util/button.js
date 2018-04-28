import React, { Component } from 'react';
import { Icon } from 'antd';
import 'antd/dist/antd.css';
import '../../css/button.css';

class BlockButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
  }
  onMouseUp() {
    this.setState({
      pressed: false
    });
  }
  onMouseDown() {
    this.setState({
      pressed: true
    });
  }
  render() {
    return <div
      onMouseUp = { this.onMouseUp.bind(this) }
      onMouseDown = { this.onMouseDown.bind(this) }
      style = {{
        display: 'inline-block',
        userSelect: 'none',
        backgroundColor: this.state.pressed ? this.props.pressedColor : this.props.inPressedColor,
        color: 'white',
        cursor: 'pointer',
        padding: 5,
      }}>
        { this.props.content }
      </div>;
  }
}
class CircleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
    this.style = {};
    this.style.borderRadius = this.props.style.width * 0.5;
    for(let key in props.style) this.style[key] = this.props.style[key];
  }
  onMouseUp() {
    this.setState({
      pressed: false
    });
  }
  onMouseDown() {
    this.setState({
      pressed: true
    });
  }
  render() {
    this.style.backgroundColor = this.state.pressed ? this.props.pressedColor : this.props.inPressedColor;
    return <div className = 'CircleButton'
      onMouseUp = { this.onMouseUp.bind(this) }
      onMouseDown = { this.onMouseDown.bind(this) }
      style = { this.props.style }>
        { this.props.icon ? <Icon type = { this.props.icon } /> : null }
        { this.props.content }
        <div className = 'after'></div>
      </div>
  }
}

export default {
  BlockButton: BlockButton,
  CircleButton: CircleButton
};
