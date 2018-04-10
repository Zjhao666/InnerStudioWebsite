
#ifndef INTERRUPT_H
#define INTERRUPT_H

#include "input.h"
#include "output.h"

struct idt_struct{
  short offset1;
  short selector;
  short no_use;
  short offset2;
};

static int a=0;
void defaultIntCallBack(){
  putd(a);
}

void enableIDT(){
  struct idt_struct *idt=0x21000;
  idt[0].offset1=0x0;
  idt[0].selector=0x0;
  idt[0].no_use=0x0;
  idt[0].offset2=0x0;
  for(int i=1;i<0x30;i++){
    idt[i].offset1=(short)((int)(void*)(defaultIntCallBack-0x8000));
    idt[i].selector=0x0008; // select code segment
    idt[i].no_use=0x8e00;
    idt[i].offset2=(short)(((int)(void*)(defaultIntCallBack-0x8000))>>16);
  }
  idt[0x21].offset1=(short)((int)(void*)(intKeyboard-0x8000));
  idt[0x21].selector=0x0008;
  idt[0x21].no_use=0x8e00;
  idt[0x21].offset2=(short)(((int)(void*)(intKeyboard-0x8000))>>16);
}

#endif
