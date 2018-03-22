
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

const drawRestTable=(data,minRest,maxRest)=>{
  // console.log(rep);
  let content=$('#RestTable .content');
  content[0].height=$(document).height()*0.4;
  content[0].width=$(document).width()*0.6;
  content.height(content.height[0]);
  content.width(content.width[0]);
  let ctx=content[0].getContext('2d'),
      width=content.width(),
      height=content.height()-30;
  // ctx.fillText('2016-2-23',0,height+10);
  // x
  ctx.strokeStyle='black';
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(0,height-20);
  ctx.lineTo(width,height-20);
  for(let i=0,part=width/4-25;i<=4;i++){
    ctx.fillText(''+i*6+'h',i*part+13,height-22);
    ctx.moveTo(i*part+10,height-20);
    ctx.lineTo(i*part+10,height-30);
  }
  ctx.stroke();
  // y
  ctx.beginPath();
  ctx.moveTo(0,height-20);
  ctx.lineTo(0,0);
  for(let i=0,part=height/4-25;i<=4;i++){
    ctx.fillText(''+i*6+'h',2,height-i*part-35);
    ctx.moveTo(0,height-i*part-30);
    ctx.lineTo(10,height-i*part-30);
  }
  ctx.stroke();
  // data
  ctx.strokeStyle='red';
  data=[
    {rest:'10',time:'xxx',i:1},
    {rest:'23',time:'xxx',i:2},
    {rest:'12',time:'xxx',i:3},
    {rest:'22',time:'xxx',i:3},
  ]
  ctx.beginPath();
  for(let i=0,limit=data.length;i<limit;i++){
    if(i==0) ctx.moveTo(10,height-20-parseFloat(data[i].rest));
    else ctx.lineTo(i*10+10,height-20-parseFloat(data[i].rest));
  }
  ctx.stroke();
};
const getAccountList=()=>{
  $.get({
    url:base+'dataFetch/accountList',
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200){
        let html='';
        for(let item of rep.data){
          let [account,community]=item.account.split(': ');
          html+=`
            <tr>
              <td class='st_name'>`+account+`</td>
              <td>`+community+`</td>
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
    },
    error:(err)=>console.log(err)
  })
};
const getAccountInfo=(account)=>{
  $.get({
    url:base+'dataFetch/accountInfo?account='+account,
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200){
        let profile=$('#AccountInfo .base .profile');
        let [pre,bef]=account.split(': ');
        profile.find('.account').html(pre);
        profile.find('.community').html(bef);
        let data=$('#AccountInfo .base .data');
        data.find('.rest').html(rep.data.rest);
        data.find('.usd').html(rep.data.usd);
        data.find('.used').html(rep.data.used);
        data.find('.valiable').html(rep.data.valiable);
        data.find('.percentage').html(rep.data.percentage);
        data.find('.totalProfit').html(rep.data.totalProfit);
      }
      else console.log(rep);
    },
    error:(err)=>console.log(err)
  })
}
const getAccountHistory=(account)=>{
  $.get({
    url:base+'dataFetch/accountHistory',
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200){
        let maxRest,minRest;
        for(let item of rep){
          if(maxRest&&item.rest>maxRest||!maxRest) maxRest=item.rest;
          if(minRest&&item.rest<minRest||!minRest) minRest=item.rest;
          item.i=parseInt(item.time.replace('-',''));
        }
        rep.sort((a,b)=>{return a.i-b.i});
        drawRestTable(rep,minRest,maxRest);
      }
      else console.log(rep);
    },
    error:(err)=>console.log(rep)
  })
};
// getAccountList();
getAccountInfo('1182391: GuanwandaGroup-Demo');
drawRestTable();
