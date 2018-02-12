let $=require('jquery')

$.post({
  url:'http://101.200.37.220:8080/InnerStudioWebsite/regis.do',
  data:{
    account:"Hello123",
    nickname:"sswsw",
    password:"123",
    realname:"张锦豪"
  },
  dataType:"JSON",
  success:(rep)=>{
    if(rep){
      console.log(rep.statuscode);
    }
  }
});
