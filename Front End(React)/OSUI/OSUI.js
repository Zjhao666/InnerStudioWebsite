"use strict";
const Block=(function(){
  let ret=function(){
    this.sname='asd';
    this.tagName='DIV';
    // this.classList
    // this.id
    this.setSize=(width,height)=>{
      if(!width){}
      else if(typeof width ==='number' && width<0){
        this.style.width($(this).parent().width()+width);
      }
      else{
        this.style.width=width;
      }
      if(!height){}
      else if(typeof height ==='number' && height<0){
        this.style.height($(this).parent().height()+height);
      }
      else{
        this.style.height=height;
      }
    }
    this.setBorder=(border)=>{
      if(border){
        this.style.border=border;
      }
      else{
        this.style.borderWidth=0;
      }
    }
    this.setColor=(color)=>{
      this.style.color=color;
    };
    this.setFont=(font)=>{
      this.style.font=font;
    };
    this.setBackground=(background)=>{
      this.style.background=background;
    };
    this.setBackgroundColor=(color)=>{
      this.style.backgroundColor=color;
    };
    this.setStyle=(style)=>{
      for(let key in style){
        this.style[key]=style[key];
      }
    };
    this.show=(method)=>{
      if(this.style.display.includes('none')){
        this.style.display=method?method:'block';
      }
    };
    this.hide=()=>{
      if(!this.style.display.includes('none')){
        this.style.display='none';
      }
    };
    this.find=(selector)=>{
      return $(this).children(selector);
    };
    this.append=(e)=>{
      $(this).append(e);
    };
  };
  ret.prototype=HTMLElement.prototype;
  return ret;
})();
let a=new Block();
console.log(a);
class Label extends HTMLElement{
  constructor(text){
    super('div');
  }
}
class Window{
  constructor(title){
    this.dom=DOM(`<div class='window'></div>`);
    this.menu=DOM(`<div class='menu'></div>`);
    this.title=new Label(title);
    this.content=DOM(`<div class='content'></div>`);
    // ---- style
    this.menu.setStyle({
      width:'100%',
      height:20,
      backgroundColor:'rgb(100,80,80)',
      borderWidth:0,
      borderRadius:0,
    });
    this.content.setStyle({
      top:20,
      bottom:0,
      borderWidth:0,
    });
    this.content.setHeight(-20);
    // ---- action
    this.menu.bind({
      'mouseenter':()=>{
        this.menu.find('.titlelabel').hide();
        this.menu.find('.controllist').show();
      },
      'mouseleave':()=>{
        this.menu.find('.controllist').hide();
        this.menu.find('.titlelabel').show();
      }
    });
  }
  // interface
  addMenuItem(title,subitem){
    let dom=$(`<span style='display:inline-block'><div class='title' style='cursor:default;'>`+title+`</div></span>`);
    // dom.html()
    this.menu.find('.controllist').append(dom);
  }
  fullscreen(){

  }
  normalsize(){

  }
  hide(){

  }
  close(){

  }
  setTitle(title){
    if(title){
      this.title.html(title);
    }
    else{
      return this.title.html();
    }
  }
  render(parent){
    // this.menu.add(this.title);
    this.dom.add(this.menu);
    this.dom.add(this.content);
    this.dom.setStyle();
    this.dom.appendTo(parent);
  }
}

window.OSUI={
  newWindow:(title)=>{
    let win=new Window(title);
    // win.addMenuItem('File');
    return win;
  }
};
