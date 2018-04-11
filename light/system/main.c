
#include "include/io.h"
#include "include/interrupt.h"
#include "include/asm.h"


void SysMain(){
  clearDisplay();
  enableIDT();

  asm_int(0x1);
  while(1) asm_hlt();
  return;
}
