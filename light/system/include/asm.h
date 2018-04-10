
#ifndef ASM_H
#define ASM_H

#define asm_hlt() __asm__("hlt")

#define asm_cli() __asm__("cli")

#define asm_sti() __asm__("sti")

#define asm_int(v) __asm__("int %0"::"i"(v))

#define asm_inb(port) ({  \
  unsigned char _v; \
  __asm__ volatile ("inb %%dx,%%al":"=a" (_v):"d" (port));  \
  _v; \
})

#define asm_outb(port, data) __asm__("outb %%al,%%dx"::"a" (data),"d" (port))

#endif
