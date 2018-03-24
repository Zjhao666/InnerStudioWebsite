
let plan_item_status;
const getStages=(target)=>{
  $.get({
    url:global_host+'plan/getStages?target='+target.attr('planid'),
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200){
        let html='';
        for(let stage of rep.data){
          if(stage){
            let status='incompleted';
            if(stage.status==0) status='current';
            else if(stage.status==1) status='completed';
            html+=`
              <div class='stage `+status+`'>
                <span class='deadLine'>`+stage.deadLine+`</span>
                <span class='s_intro'>`+stage.target+`</span>
                <div class='commentList'>`;
            for(let comment of stage.comments){
              html+=`
                <div class='comment'>
                  <div class='c_header'>
                    <span class='c_account'>`+comment.account+`</span>
                    <span class='c_time'>`+comment.commentTime+`</span>
                  </div>
                  <span class='c_content'>`+comment.comment+`</span>
                </div>`;
            }
            html+=`</div></div>`;
          }
          target.children('.stageList').html(html);
        }
      }else console.log(rep);
    }
  })
};
const getPlans=(beCompleted)=>{
  $.get({
    url:global_host+'plan/getPlans?beCompleted='+beCompleted,
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200){
        let html='',i=0;
        for(let item of rep.data){
          html+=`
            <div class='pc_item' planid=`+item.planid+` stageNum=`+item.stageNum+` style='top:`+i*30+`px;'>
              <span class='title'>`+item.title+`</span>
              <span class='createTime'>`+item.regisTime+`</span>
              <span class='expectTime'>`+item.deadLine+`</span>
              <span class='introduction'>`+item.description+`</span>
              <div class='stageList'></div>
            </div>
            `;
          i++;
        }
        $('#PlanCurrent .pc_wrapper').html(html);
        $('#PlanCurrent .pc_wrapper .pc_item').each((i,elem)=>{
          /* $(elem).click(()=>{
            if(plan_item_status){
              for(let i in plan_item_status){
                plan_item_status[i].
              }
            }
            let offset=$(elem).height(),beStart=false;
            plan_item_status={};
            $('#PlanCurrent .pc_wrapper .pc_item').each((i,a_elem)=>{
              if(beStart){
                let tmp=parseInt($(a_elem).css('top').replace('px',''));
                // save status
                plan_item_status[$(a_elem).attr('planid')]={
                  elem:a_elem,
                  top:tmp
                };
                $(a_elem).animate({top:top+offset},400);
              }
              else if(a_elem==elem) beStart=true;
            });
            if(parseInt($(elem).attr('stageNum'))>0)getStages($(elem));
          }); */
        });
      }else console.log(rep);
    }
  })
};
let plan_nav_Current=$('#Plan .nav').find('.nav_Current');
let plan_nav_Completed=$('#Plan .nav').find('.nav_Completed');
plan_nav_Completed.click(()=>{
  getPlans(1);
  plan_nav_Current[0].classList.remove('selected')
  plan_nav_Completed[0].classList.add('selected');
});
plan_nav_Current.click(()=>{
  getPlans(0);
  plan_nav_Completed[0].classList.remove('selected')
  plan_nav_Current[0].classList.add('selected');
});
plan_nav_Current.click();
