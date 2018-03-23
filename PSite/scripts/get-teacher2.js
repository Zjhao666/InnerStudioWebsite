$(document).ready(
    function(){
        $.ajax({
            type:"GET",
            url:"http://101.200.37.220:8080/StudioWebsite/Teacher.do",
            dataType:'JSON',
            success:function(data){

                for(var i=0;i<data.length;i++){
                    $(".name")[i].append(data[i].name);
                    $(".degree")[i].append(data[i].degree);
                    $(".title")[i].append(data[i].title);
                    $(".office")[i].append(data[i].office);
                    $(".contact")[i].append(data[i].contact);
                    $(".profile .right")[i].append(data[i].profile);
                    $(".researchDirection .right")[i].append(data[i].researchDirection);
                    $(".research .right")[i].append(data[i].research);
                    $(".award .right")[i].append(data[i].award);
                    $(".teaching .right")[i].append(data[i].teaching);
                }

            }
        })
    }
)