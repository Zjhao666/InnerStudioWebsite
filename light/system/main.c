
#include "include/output.h"
#include "include/interrupt.h"
#include "include/asm.h"


void SysMain(){
  enableIDT();
  puts("Hello,Light!");
  asm_int(0x21);
  while(1) asm_hlt();
  return;
}
