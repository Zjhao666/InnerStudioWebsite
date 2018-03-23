$(document).ready(
    function(){
      $.ajax({
          type:"GET",
          url:"http://101.200.37.220:8080/StudioWebsite/Member.do",
          dataType:"json",
          success:function(data){
              var degree = new Array();
              var degreeStr=new Array();
              var name = new Array();
              var phone = new Array();
              var sex = new Array();
              var skill = new Array();
              var qq = new Array();
              var pertag = new Array();

              for(var i=0;i<data.length;i++){
                  name[i]=data[i].name;
                  degree[i]=data[i].degree;
                  sex[i]=data[i].sex;
                  skill[i]=data[i].skill;
                  qq[i]="QQ:"+data[i].qq;
                  phone[i]="TEL:"+data[i].phone;
                  pertag[i]=data[i].pertag;
                  degreeStr[i]="大学"+degree[i]+"年级";
                  $(".stuname")[i].append(name[i]);
                  $(".studegree")[i].append(degreeStr[i]);
                  $(".skill")[i].append(skill[i]);
                  $(".qq")[i].append(qq[i]);
                  $(".tel")[i].append(phone[i]);
                  $(".tag")[i].append(pertag[i]);

              }
          }
            }

        )
    }
)