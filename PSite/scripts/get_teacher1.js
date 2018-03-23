$(document).ready(
function(){
$.ajax({
    type:"GET",
    url:"http://101.200.37.220:8080/StudioWebsite/Teacher.do",
    dataType:'JSON',
    success:function(data){
        var name=new Array();
        var researchDirection = new Array();
        var contact = new Array();
        var nameString = new Array();



        for(var i =0;i<data.length;i++){
            name[i] = data[i] .name;
            researchDirection[i]=data[i].researchDirection;
            contact[i]=data[i].contact;
            nameString[i]=name[i];

            $(".name a")[i].append(nameString[i]);
            $(".research")[i].append(researchDirection[i]);
            $(".teaching")[i].append(contact[i]);
        }
    }
})
}
)