import React, { Component } from 'react';

export default class Headimg extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let img = this.props.src;
    return <img src = {require('../../img/headimg.png')} style = {{
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundSize: 'cover'
    }}></img>;
  }
}
