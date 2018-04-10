
#include <stdio.h>

#define inb(port) ({ \
unsigned char _v; \
__asm__ volatile ("inb %%dx,%%al":"=a" (_v):"d" (port)); \
_v; \
})

int main(){
  int port=10;
  int output=inb(port);
  printf("%d\n",output);
  return 0;
}
