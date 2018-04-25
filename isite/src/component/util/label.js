import React, { Component } from 'react';

// action label
class ALabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: this.props.clicked
    };
  }
  onClick() {
    this.props.onClick(this.props.id);
  }
  render() {
    this.state.clicked = this.props.clicked;
    return <div
      onClick = { this.onClick.bind(this) }
      style = {{
        display: 'inline-block',
        boxSizing: 'content-box',
        userSelect: 'none',
        textShadow: '1px 1px 3px black',
        backgroundColor: this.state.clicked ? 'rgb(120, 200, 200)' : 'rgb(120, 220, 220)',
        borderLeft: this.state.clicked ? '1px solid rgb(120, 160, 180)' : 'none',
        color: 'white',
        cursor: 'pointer',
        padding: 5,
      }}>
        { this.props.content }
      </div>;
  }
}

// no action label
class NALabel extends Component {
  constructor(props) {
    super(props);
    this.style = {
      font: 'normal 1em ArtegraSansExtended'
    };
    for (let key in props.style) this.style[key] = props.style[key];
  }
  render() {
    return <div style = { this.style }>
      { this.props.content }
    </div>
  }
}

export default {
  Label: ALabel,
  NALabel: NALabel
}
