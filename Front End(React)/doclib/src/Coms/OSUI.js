
import Window from './Window'

export default class OSUI {
  constructor(){
  }
  newWindow(title){
    let win=new Window(title);
    return win.render();
  }
}
