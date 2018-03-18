
let base='http://localhost:8081/'

function validate(ac,pw,callback){
  $.get({
    url:base+'login/pk',
    dataType:'JSON',
    success:(rep)=>{
      let encryptObj=new JSEncrypt();
      encryptObj.setKey(rep.key);
      $.post({
        url:base+'login/validate',
        data:{
          cipher_ac:encryptObj.encrypt(ac),
          cipher_pw:encryptObj.encrypt(pw)
        },
        dataType:'JSON',
        success:(rep)=>{
          callback(rep);
        }
      });
    }
  })
}
