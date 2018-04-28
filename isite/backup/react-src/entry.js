import React, { Component } from 'react';
import Home from './component/home/home';

export default class Entry extends Component {
  constructor() {
    super();
    this.state = {
      textLeftPos: 'calc(100% * -1)',
      textTopPos: 'calc(30%)',
      opacity: 1,
      loaded: false
    }
    this.show();
  }
  show() {
    let x = 100;
    let timer = setInterval(() => {
      x--;
      if (x <= -10) clearInterval(timer);
      this.setState({textLeftPos: 'calc(' + x + '% * -1)'});
    }, 20);
    setTimeout(() => this.hide(), 4000);
  }
  hide() {
    let x = 100;
    let timer = setInterval(() => {
      x -= 2;
      if (x <= 0) {
        clearInterval(timer);
        this.setState({loaded: true});
      }
      this.setState({opacity: '' + x / 100});
    }, 20);
  }
  render() {
    if (this.state.loaded) return <Home />;
    else return <div id = 'Entry' style = {{left: this.state.textLeftPos, top: this.state.textTopPos, opacity: this.state.opacity }}>
      <span className = 'title'>Mobile AI</span>
      <span className = 'slogan'>to the best of you</span>
    </div>;
  }
}
