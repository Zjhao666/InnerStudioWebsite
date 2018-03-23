$("#btn").click(
    function(){
        $.post(
            "http://101.200.37.220:8080/StudioWebsite/Leaveword.do",
            {
                content:$("#message").val(),
                contact:$("#connect").val()

            },function(data,textStatus){
                alert("留言成功！");
                $("#message").value=" ";
                $("#connect").value=" ";

            }
        )
    }
)