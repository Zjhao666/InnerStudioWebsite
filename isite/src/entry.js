import React, { Component } from 'react';

export default class Entry extends Component {
  constructor() {
    super();
    this.state = {
      textLeftPos: 'calc(100% * -1)',
      textTopPos: 'calc(30%)'
    }
    setTimeout(() => this.show());
  }
  show() {
    let x = 100;
    let timer = setInterval(() => {
      x--;
      if (x <= -10) {
        clearInterval(timer);
      }
      this.setState({textLeftPos: 'calc(' + x + '% * -1)'});
    }, 20);
    setTimeout(() => this.hide(), 5000);
  }
  hide() {
    let x = 30;
    let timer = setInterval(() => {
      x--;
      if (x <= -30) {
        clearInterval(timer);
      }
      this.setState({textTopPos: x + '%'});
    }, 20);
  }
  render() {
    return <div id = 'Entry' style = {{left: this.state.textLeftPos, top: this.state.textTopPos}}>
      <span className = 'title'>Mobile AI</span>
      <span className = 'slogan'>to the best of you</span>
    </div>
  }
}
