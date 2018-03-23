$("#btn").click(
    function(){
        $.post("http://101.200.37.220:8080/StudioWebsite/Login.do",
            {
                ac:$("#uname").val(),
                pw:$("#pword").val(),
                dataType:'JSONP'

            },function(data,textStatus){
               if(data==200){
                   alert("登陆成功！")
               }else if(data==202){
                   alert("账户不存在!")
               }else{
                   alert("密码错误！")
               }
            })
    }
)