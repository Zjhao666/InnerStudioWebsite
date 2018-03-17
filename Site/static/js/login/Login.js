
let base='http://localhost:8081/'

function validate(ac,pw,callback){
  $.get({
    url:base+'login/pk',
    dataType:'JSON',
    success:(rep)=>{
      let encryptObj=new JSEncrypt();
      encryptObj.setKey(rep.key);
      let data=encryptObj.encrypt(ac+'&'+pw);
      $.post({
        url:base+'login/validate',
        data:{cipher:data},
        dataType:'JSON',
        success:(rep)=>{
          if(rep.statuscode==200) callback(true);// validate successfully
          else callback(false);
        }
      });
    }
  })
}
