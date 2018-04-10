
.code16
.global _start

.section .text
_start:
  jmp entry
  .byte   0x90
  .ascii  "HELLON"
  .word   512
  .byte   1
  .word   1
  .byte   2
  .word   224
  .word   2880
  .byte   0xf0
  .word   9
  .word   18
  .word   2
  .long   0
  .long   2880
  .byte   0,0,0x29
  .long   0xffffffff
  .ascii  "HELLO-OS  "
  .ascii  "FAT12  "
  .fill   18

.set  SETUPLEN,4
.set  SETUPSEG,0x0800
.set  SETUPLOC,0x8000

entry:
  movw $SETUPSEG,%ax
  movw %ax,%es

load_system:
  movw $0x0,%dx # driver 0, head 0
  movw $0x2,%cx # track 0, sector 2
  movw $0x0,%bx # address = 0
  movw $0x0200+SETUPLEN,%ax # service 2, nr of sectors
  int $0x13
  jnc ok_load_system
  # reset the diskette
  movw $0x0,%dx
  movw $0x0,%ax
  int $0x13
  jmp load_system

ok_load_system:
  jmp SETUPLOC

marker:
  .fill 0x1fe-(marker-_start)
  .byte 0x55,0xaa
