
// project doc
let projectDoc=$('#Regisproject .Essential .projectDoc'),
    projectDocInner=projectDoc.children('.inner');
projectDoc.click((e)=>{
  if(e.target==projectDoc[0]){
    projectDocInner.click();
    projectDoc.css('font-weight','bold');
  }
});
const pdOnchange=()=>{
  projectDoc.html(projectDocInner[0].files[0].name);
  projectDocInner.change(pdOnchange);
};
projectDocInner.change(pdOnchange);
// member operation
let btn_add=$('#Regisproject .Essential .members .btn_add'),btn_add_hovered=false,
    btn_del=$('#Regisproject .Essential .members .btn_del'),btn_del_hovered=false;

btn_add.bind({
  mouseenter:()=>{
    btn_add.css('background-color','rgb(160,160,160)');
    btn_add_hovered=true;
  },
  mouseleave:()=>{
    btn_add.css('background-color','rgb(200,200,200)');
    btn_add_hovered=false;
  },
  click:()=>{
    bing();
  }
})
btn_del.bind({
  mouseenter:()=>{
    btn_del.css('background-color','rgb(160,160,160)');
    btn_del_hovered=true;
  },
  mouseleave:()=>{
    btn_del.css('background-color','rgb(200,200,200)');
    btn_del_hovered=false;
  },
  click:()=>{
    bing();
  }
})
