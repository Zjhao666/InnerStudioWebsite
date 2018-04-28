import React, { Component } from 'react';
import reqwest from 'reqwest';
import { Icon } from 'antd';
import 'antd/dist/antd.css';
import SelectBar from '../util/selectbar';
import Button from '../util/button';
import Label from '../util/label';
import Headimg from './headimg';

const CircleButton = Button.CircleButton;
const NALabel = Label.NALabel;

export default class Schedule extends Component {
  constructor() {
    super();
    this.state = {
      data: [{content: ' learning python', completed: true, time: '12:50'},
      {content: ' learning python', completed: false, time: '22:00'}]
    };
  }
  render() {
    let itemList = [];
    for (let i = 0; i < this.state.data.length; i++) {
      let item = this.state.data[i];
      itemList.push(<span style = {{
          display: 'block',
          position: 'relative',
          backgroundColor: (item.completed) ? 'rgb(120, 200, 130)' : 'rgb(200, 200, 80)',
          width: '100%',
          color: 'white',
          font: 'bold 1.2em ArtegraSansExtended'
        }} key = { i }>
          { item.content }
          { !item.completed ? <CircleButton icon = 'check' style = {{ position: 'absolute', bottom: 0, right: 60, width: 22, height: 22 }}/> : null }
          <NALabel content = { item.time } style = {{ position: 'absolute', bottom: 0, right: 0 }}/>
      </span>);
    }
    let history = [];
    return <div style = {{width: '100%'}}>
      <div style = {{
        display: 'inline-block',
        width: 'calc(60% - 20px)',
        marginLeft: 10, marginRight: 10,
      }}>{ itemList }</div>
      <div style = {{
        display: 'inline-block',
        verticalAlign: 'top',
        width: 'calc(40% - 20px)',
        marginLeft: 10, marginRight: 10,
      }}>
        <div style = {{margin: '0px 0px 20px'}}>
          <div style = {{
            display: 'inline-block',
            height: 30, paddingTop: 5,
            verticalAlign: 'top',
            backgroundColor: 'rgb(120, 190, 255)',
            color: 'white'
          }}><Icon type = 'bars' />
          </div>
        </div>
        { history }
      </div>
    </div>
    // <SelectBar items = { ['last week', 'last month', 'last 3 month'] } />
  }
}
