import React, { Component } from 'react';

export default class Block extends Component {
  render() {
    return <div style = {{
      display: 'inline-block',
      backgroundColor: this.props.color,
      width: this.props.width || 400,
      height: this.props.height || 80,
      color: 'white',
      font: 'normal 2em ArtegraSansExtended',
      textAlign: 'center',
    }}>
      { this.props.content }
    </div>
  }
}
