
let base='http://'+window.location.host+'/';
// click effect
let audioClickEffect=document.getElementById('AudioClickEffect');
const bing=()=>{
  if(!audioClickEffect.paused) audioClickEffect.pause();
  audioClickEffect.currentTime=0;
  audioClickEffect.play();
};

// header
let btnSearch=$('#main .header .searchbox .search');
btnSearch.bind({
  mouseenter:()=>btnSearch.css('border-width','1px'),
  mouseleave:()=>btnSearch.css('border-width','0px'),
  mousedown:()=>btnSearch.css('background-color','rgb(50,150,255)'),
  mouseup:()=>btnSearch.css('background-color','transparent')
});

// navigate
let navigate=$('#main .navigate');
navigate.children('.item').each((i,elem)=>{
  let jqe=$(elem),hovered=false;
  jqe.bind({
    mouseenter:()=>{
      hovered=true;
      jqe.css('background-color','rgb(70,100,200');
    },
    mouseleave:()=>{
      hovered=false;
      jqe.css('background-color','transparent');
    },
    mousedown:()=>jqe.css('background-color','rgb(50,100,160)'),
    mouseup:()=>{
      if(hovered){
        jqe.css('background-color','rgb(70,100,200)');
      }
      else{
        jqe.css('background-color','transparent');
      }
    }
  });
});

const getAccountList=()=>{
  $.get({
    url:base+'dataFetch/accountList',
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200){
        let html='';
        for(let item of rep.data){
          html+=`
            <tr>
              <td class='st_name'>`+item.account+`</td>
              <td class='t_dollars'>`+item.rest+`</td>
              <td>`+item.usd+`</td>
              <td class='t_dollars'>`+item.used+`</td>
              <td class='t_dollars'>`+item.valiable+`</td>
              <td class='t_percentage'>`+item.percentage+`</td>
              <td>`+item.totalProfit+`</td>
            </tr>`;
        }
        $('#SignalRank tbody').html(html);
      }
      else console.log(rep);
    }
  })
};
const getAccountInfo=()=>{
  
}
