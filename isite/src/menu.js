
  <menu class='menu'>
    <menu-item class='item' key='1'>
      <icon class='icon-chat'></icon>
      <span>Chat</span>
    </menu-item>
    <menu-item class='item' key='2'>
      <icon class='icon-today'></icon>
      <span>Today</span>
    </menu-item>
  </menu>

const $ = require('jquery');

class Menu {
  constructor() {
    this.selected = undefined;
    this.items = [];
    this.root = $(`<menu class='menu'></menu>`);
  }
  onClick(key) {
    let tmp = this.items[parseInt(key)];
    tmp.css({
      backgroundColor: 'black'
    });
    if (this.selected) {
      this.selected.css({
        backgroundColor: 'transparent'
      });
      this.selected = tmp;
    }
  }
  addItem(name, icon, onClick) {
    let tmp = $(`
      <menu-item class='item' key='` + this.items.length + `'>
        <icon class=` + icon + `></icon>
        <span>` + name + `</span>
      </menu-item>
      `);
    tmp.click(() => {
      this.onClick(tmp.attr('key'));
      onClick(tmp);
    })
    this.items.push(tmp);
    this.root.append(tmp);
  }
  addSubMenuItem(onClick, children) {

  }
}
