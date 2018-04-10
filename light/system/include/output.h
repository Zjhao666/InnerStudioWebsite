
#ifndef OUTPUT_H
#define OUTPUT_H

static int color=0x70;
static int cursorAddr=0;

void putc(char c){
  char *p=0xb8000;
  *(p+cursorAddr)=c;
  *(p+cursorAddr+1)=color;
  cursorAddr+=2;
}
void puts(char *s){
  for(int i=0;s[i]!='\0';i++) putc(s[i]);
}
void putsl(char *s, int length){
  for(int i=0;i<length;i++) putc(s[i]);
}
void putd(int n){
  if(n==0){
    putc('0');
  } else {
    int length,tmp;
    char buf[10]={0};
    for(length=0;n!=0;length++){
      tmp=n%10;
      n=(n-tmp)/10;
      buf[length]=tmp+48;
    }
    for(int i=0,limit=length/2;i<limit;i++){
      char a=buf[i];
      buf[i]=buf[length-i-1];
      buf[length-i-1]=a;
    }
    putsl(buf,length);
  }
}
void printf(char *format, ...){
  for(int i=0,offset=(int)(void*)&format;format[i]!='\0';i++){
    if(format[i]=='%'){
      i++;
      offset+=4;
      // align = 4
      if(format[i]=='d'){
        putd(*(int*)offset);
      } else if(format[i]=='s'){
        puts(*(int*)offset);
      } else if(format[i]=='c'){
        putc(*(int*)offset);
      } else {
        putc(format[--i]);
        offset-=4;
      }
    } else putc(format[i]);
  }
}

#endif
