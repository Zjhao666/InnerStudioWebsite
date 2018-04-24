import React, { Component } from 'react';

export default class Headimg extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let img = this.props.src;
    return <img src = {require('../../img/headimg.png')} style = {{
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundSize: 'cover'
    }}></img>;
  }
}
