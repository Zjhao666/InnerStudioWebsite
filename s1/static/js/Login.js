
let base='http://'+window.location.host+'/';

$('.btn_login').click(()=>{
  $('.btn_login').css('opacity',0);
  $('.btn_login').animate({opacity:1},500);
});

$('.btn_regis').click(()=>{
  $('.btn_regis').css('opacity',0);
  $('.btn_regis').animate({opacity:1},500);
  $('.login').css('filter','blur(10px)');
  $('.regis').css('display','block');
  $('.regis').animate({opacity:1},300);
});

document.loginForm.onsubmit=()=>{
  request('login/validate',document.loginForm.account.value,document.loginForm.password.value,
    (rep)=>{
      if(rep.statuscode==200){
        window.location.href=base+'/home.html';
      }
      else notify('验证失败');
    });
  return false;
};
document.regisForm.onsubmit=()=>{
  if(document.regisForm.password.value==document.regisForm.repeat_password.value){
    request('login/regis',document.regisForm.account.value,document.regisForm.password.value,
      (rep)=>{
        if(rep.statuscode==200){
          notify('注册成功');
          $('.regis').animate({opacity:0},300);
          setTimeout(()=>{
            $('.login').css('filter','none');
            $('.regis').css('display','none');
          },300);
        }
        else if(rep.statuscode=201){
          notify('帐号已存在');
        }
        else notify('注册失败');
      });
  }
  else notify('两次密码不一样');
  return false;
};

function request(urlpart,ac,pw,callback){
  $.get({
    url:base+'login/pk',
    dataType:'JSON',
    success:(rep)=>{
      let encryptObj=new JSEncrypt();
      encryptObj.setKey(rep.key);
      $.post({
        url:base+urlpart,
        data:{
          cipher_ac:encryptObj.encrypt(ac),
          cipher_pw:encryptObj.encrypt(pw)
        },
        dataType:'JSON',
        success:callback
      });
    },
    error:(err)=>console.log(err)
  })
}
function notify(msg){
  let target=$('#notification');
  target.html(msg);
  target.css({
    display:'block',
    opacity:1,
    left:($('body').width()-target.width())/2,
    top:($('body').height()-target.height())/2+200
  });
  setTimeout(()=>{
    target.animate({opacity:0},300);
    setTimeout(()=>target.css({display:'none',opacity:1}),500)
  },1500);
}
