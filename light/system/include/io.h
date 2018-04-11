
#ifndef IO_H
#define IO_H

/* disk operation */
/*
extern inline raw_read(char *buf, int bytes){
  int sectors=bytes/512;
  if(bytes%512!=0) sectors++;
  __asm__(
    // set sector num to read
    "movw $0x1f2,%%dx\n\t"
    "movb %0,%%al\n\t"
    "outb %%al,%%dx\n\t"
    // set start LBA
    "movw $0x1f3,%%dx\n\t"// 0x1f3
    "movb $0x02,%%al\n\t"
    "outb %%al,%%dx\n\t"  // LBA 7-0
    "incw %%dw\n\t"       // 0x1f4
    "movb $0x0,%%al\n\t"
    "outb %%al,%%dx\n\t"  // LBA 15-8
    "incw %%dw\n\t"       // 0x1f5
    "outb %%al,%%dx\n\t"  // LBA 23-16
    "incw %%dw\n\t"       // 0x1f6
    "movb $0xe0,%%al\n\t" // LBA mode
    "movb %%al,%%dx\n\t"  // LBA 27-24
    // set read service
    "movw $0x1f7,%%dx\n\t"
    "movb $0x20,%%al\n\t"
    "outb %%al,%%dx"
    // wait until read operation finished
    "movw $0x1f7,%%dx\n\t"
    ".waits:"
    "inb %%dx,%%al\n\t"
    "andb $0x88,%%al"
    "cmpl $0x88,%%al"
    "jnz .waits"
    //
  );
}
*/
extern inline raw_write(char *buf){

}

/* video output */
// 80 * 25
#define C_WIDTH 160
#define C_HEIGHT 50

static int color=0x07;  // bl fg(rgb) bg(rgb)
static int cursorAddr=0;

void clearDisplay(){
  char *p=0xb8000;
  for(int i=0;i<C_HEIGHT;i++){
    for(int j=0;j<C_WIDTH;j++){
      *(p+i*80+j)=0;
    }
  }
}

void putc(char c){
  char *p=0xb8000;
  if(c=='\n'){
    cursorAddr+=C_WIDTH-cursorAddr%C_WIDTH;
  } else if(c=='\t'){
    cursorAddr+=8;  // 4 space
  } else if(c==' '){
    cursorAddr+=2;
  } else {
    *(p+cursorAddr)=c;
    *(p+cursorAddr+1)=color;
    cursorAddr+=2;
  }
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
