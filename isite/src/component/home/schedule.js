import React, { Component } from 'react';
import reqwest from 'reqwest';
import Headimg from './headimg';
import Button from './button';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

export default class Schedule extends Component {
  constructor() {
    super();
    this.state = {
    };
  }
  render() {
    let items = [{content: ' learning python', completed: 'false', time: '12:50'},
    {content: ' learning python', completed: 'false', time: '22:00'}];
    let itemList = [];
    for (let item of items) {
      itemList.push(<span style = {{
          display: 'block',
          position: 'relative',
          backgroundColor: 'rgb(140, 220, 150)',
          height: 80, width: 600,
          marginTop: 20,
          color: 'white',
          boxShadow: '2px 2px 3px rgb(130, 160, 140)',
          font: 'normal 2em ArtegraSansExtended'
        }}>
          { item.content }
          <Button icon = 'check' style = {{
            display: 'block',
            position: 'absolute',
            bottom: 30, right: 0,
          }}/>
          <Button status = { true } content = { item.time } style = {{
            display: 'block',
            position: 'absolute',
            bottom: 0, right: 0,
            font: 'normal 0.8em ArtegraSansExtended',
            textShadow: '1px 1px 0px gray',
          }} />
      </span>);
    }
    return <div style = {{width: '100%'}}>
      <div>{ itemList }</div>
    </div>
  }
}
