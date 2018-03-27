
const projectBindAction=(target)=>{
  $(target).attr('projectBinded','true');
  $(target).find('.stage').each((i,elem)=>{
    let stage=$(elem);
    if(stage.find('.comments').length>0){
      let comments=$(elem).find('.comments'),
          height=comments.height(),visible=true;
      stage.css('cursor','pointer');
      stage.click(()=>{
        if(visible){
          visible=false;
          comments.animate({height:0},300);
          setTimeout(()=>comments.css('display','none'),300);
        }
        else{
          visible=true;
          comments.css('display','block');
          comments.animate({height:height},300);
        }
      });
      stage.click();
    }
  });
};

// navigate
let pNavigateSelected;
$('#Profile .Navigate').children('.item').each((i,elem)=>{
  $(elem).bind({
    'click':()=>{
      if(pNavigateSelected!=elem){
        if(pNavigateSelected){
          $(pNavigateSelected).css({
            borderBottomWidth:0,
            color:'white'
          });
        }
        $(elem).css({
          borderBottomWidth:2,
          color:'rgb(200,180,120)'
        });
        pNavigateSelected=elem;
        // display frame
        let identifier=$(elem).html();
        if(identifier.includes('Details')){
          $('#Profile .Details').css('display','block');
          $('#Profile .Schedule').css('display','none');
          $('#Profile .CompletedProjects').css('display','none');
        }
        else if(identifier.includes('Schedule')){
          $('#Profile .Details').css('display','none');
          $('#Profile .Schedule').css('display','block');
          $('#Profile .CompletedProjects').css('display','none');
        }
        else if(identifier.includes('Completed')){
          $('#Profile .Details').css('display','none');
          $('#Profile .Schedule').css('display','none');
          $('#Profile .CompletedProjects').css('display','block');
          if(!$('#Profile .CompletedProjects').attr('projectBinded')) projectBindAction($('#Frames #Profile .CompletedProjects'));
        }
      }
    },
    'mouseenter':()=>{
      if(pNavigateSelected!=elem){
        $(elem).css({
          borderBottomWidth:1
        });
      }
    },
    'mouseleave':()=>{
      if(pNavigateSelected!=elem){
        $(elem).css({
          borderBottomWidth:0
        });
      }
    }
  });
});

window.onload=()=>$('#Profile .Navigate').children('.item').eq(1).click();

// calendar
$(document).ready(function(){
  // CALENDAR
  $('#Calendar #calendar').datepicker({
    onSelect:(time,inst)=>{
      console.log(time);
      console.log(inst);
    }
  });
  // TIME & DATE
  var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var months = ['JAN','FEB','MAR','APR','MAY','JUNE','JULY','AUG','SEP','OCT','NOV','DEC'];
  var d = new Date(); var year = d.getFullYear();
  function getTime() {
    var date = new Date(), hour = date.getHours();
    var dd = 'AM'; var h = hour;
    if ( h > 12 ) { h = hour - 12; dd = 'PM'; }
    if ( h == 0 ) { h = 12; }
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      hour: appendZero(h),
      minute: appendZero(date.getMinutes()),
      dd: dd
    };
  };
  function appendZero(num) {
    if ( num < 10 ) { return '0' + num; }
    return num;
  };
  function refreshClock() {
    var now = getTime();
    $('#Calendar #date_time').html('<div class="time">' + now.hour + ':' + now.minute + ' ' + now.dd + '</div><div class="date">' + now.day + ', ' + now.month + ' ' + now.date + ', ' + year + '</div>');
    setTimeout(function(){
      refreshClock();
    });
  };
  refreshClock();
});
