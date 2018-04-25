import React, { Component } from 'react';
import Label from './label';

const ALabel = Label.ALabel;

export default class SelectBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.default || 0
    };
  }
  onClick(id) {
    this.setState({
      selected: id
    });
  }
  render() {
    let labelList = [];
    for (let i = 0; i < this.props.items.length; i++) {
        labelList.push(<ALabel onClick = { this.onClick.bind(this) } content = { this.props.items[i] } clicked = { i == this.state.selected } style = {{
          borderLeft: '1px solid white'
        }} id = { i } key = { i }/>);
    }
    return <div style = {{ display: 'inline-block' }}>{ labelList }</div>;
  }
}
