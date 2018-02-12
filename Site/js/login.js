let baseurl='http://101.200.37.220:8080/InnerStudioWebsite/';
$(document).ready(function() {
    $('.page-container .form .submit').click(()=>{
        let username=$('.form .username').val();
        let password=$('.form .password').val();
        if(username==''){
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '27px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.username').focus();
            });
            return;
        }
        if(password==''){
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '96px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.password').focus();
            });
            return;
        }
        // submit
        $.get({
          url:baseurl+'login.do?ac='+username+'&pw='+password,
          dataType:'JSON',
          success:(rep)=>{
            if(rep.statuscode==200){
              if(rep.admin){
                window.location.href=baseurl+'admin.html';
              }
              else{
                window.location.href=baseurl+'home.html';
              }
            }
            else{}
          },
        });
    });
    $('.page-container .form .username, .page-container .form .password').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });
});
