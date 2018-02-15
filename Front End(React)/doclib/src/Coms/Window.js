import React,{Component} from 'react'

export default class Window{
  constuctor(title){

  }
  render(){
    let c=React.createClass({
      getInitialState:function(){
        this.style={
          position:'absolute',
          height:300,
          width:300,
          backgroundColor:'white',
          borderRadius:10,
          border:'1px solid black'
        };
        return {};
      },
      render:function(){
        return(<div style={this.style}></div>);
      }
    });
    return c;
  }
}
