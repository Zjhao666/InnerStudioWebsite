
const calProjectTime=(start,end)=>{
  return 'xxx';
};
const getProjects=()=>{
  $.get({
    url:global_host+'project/getProjects',
    dataType:'JSON',
    success:(rep)=>{
      if(rep.statuscode==200){
        let html='';
        for(let item of rep.data){
          if(item){
            let stageNum=0;
            for(let tmp of item.stage) if(tmp) stageNum++;
            html+=`
            <div class='Pitem'>
            <span class='title'>`+item.title+`</span>
            <span class='description'>`+item.description+`</span>
            <div class='statistics'>
              <div class='labelData'>
                <span class='label'>注册时间</span>
                <span class='value'>`+item.regisTime+`</span>
              </div>
              <div class='labelData'>
                <span class='label'>截止时间</span>
                <span class='value'>`+item.expectedTime+`</span>
              </div>
              <div class='labelData'>
                <span class='label'>项目时长</span>
                <span class='value'>`+calProjectTime(item.regisTime,item.expectedTime)+`</span>
              </div>
              <div class='labelData'>
                <span class='label'>计划阶段数</span>
                <span class='value'>`+stageNum+`</span>
              </div>
              <div class='percentData'>
                <span class='label'>项目完成度</span>
                <span class='value' style='width: `+item.completionDegree+`%;'>`+item.completionDegree+`%</span>
              </div>
              <div class='percentData'>
                <span class='label'>项目活跃度</span>
                <span class='value' style='width: `+item.activity+`;'>`+item.activity+`%</span>
              </div>
            </div>
            <ul class='list'>`;
            for(let stage of item.stage){
              if(stage){
                let status='incompleted';
                if(stage.status==0) status='current';
                else if(stage.status==1) status='completed';
                html+=`
                <li class='stage '`+status+`>
                <span class='timestamp'>`+stage.timestamp+`</span>
                <span class='content'>`+stage.target+`</span>
                <div class='comments'>`;
                for(let comment of stage.comment){
                  if(comment){
                    html+=`
                    <div class='item'>
                    <span class='account'>`+comment.account+`</span>
                    <span class='time'>`+comment.timestamp+`</span>
                    <span class='words'>`+comment.content+`</span>
                    </div>`;
                  }
                }
                html+=`
                </div>
                </li>`;
              }
            }
            html+=`
            </ul>
            </div>`;
          }
        }
        $('#Project .pj_wrapper').html(html);
      }else console.log(rep);
    }
  })
};
getProjects();
