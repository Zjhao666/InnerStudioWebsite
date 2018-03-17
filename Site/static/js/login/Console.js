
let consoleContent=$('#Login .Console .c_content');

let programCounter=-1;
let account,password;
const getLastLine=()=>{
  return consoleContent.children('.line').last();
};
const handleCmd=(cmd)=>{
  if(programCounter>-1){ // login
    if(programCounter==0){
      programCounter++;
      account=cmd
      consoleContent.append(`<br /><span class='line retline'>Enter password:</span>`);
      consoleContent.append(`<br /><span class='line retline'></span>`);
    }
    else if(programCounter==1){
      password=cmd;
      // ajax login
      programCounter=-1;
      consoleContent.append(`<br /><span class='line retline'>Validate successfully.</span>`);
      consoleContent.append(`<br /><span class='label'>Guest Sessin:</span>\n<span class='line'></span>`);
      window.open('home.html');
    }
  }
  else{
    if(cmd.length==0){
      consoleContent.append(`<br /><span class='line retline'>Enter -h for help</span>`);
      consoleContent.append(`<br /><span class='label'>Guest Sessin:</span>\n<span class='line'></span>`);
    }
    else{
      if(cmd.startsWith('login')&&cmd.length==5){
        programCounter++;
        consoleContent.append(`<br /><span class='line retline'>Enter account:</span>`);
        consoleContent.append(`<br /><span class='line retline'></span>`);
      }
      else{
        consoleContent.append(`<br /><span class='line retline'>command '`+cmd+`' not found</span>`);
        consoleContent.append(`<br /><span class='label'>Guest Sessin:</span>\n<span class='line'></span>`);
      }
    }
  }
};
$(document).keypress((e)=>{
  if(e.which==13){ // enter
    handleCmd(getLastLine().html());
    consoleContent.scrollTop(consoleContent[0].scrollHeight-consoleContent.height());
    e.stopPropagation();
  }
  else if(e.which==8){ // backspace
    let line=getLastLine();
    if(line.length>0){
      let tmp=line.html();
      line.html(tmp.substring(0,tmp.length-1));
    }
    e.stopPropagation();
  }
  else if(e.originalEvent.charCode>0&&e.originalEvent.key){
    //e.originalEvent.charCode
    let line=getLastLine();
    if(programCounter==1) line.append('*');
    else line.append(e.originalEvent.key);
  }
});
