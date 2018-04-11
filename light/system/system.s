
.code16
.global start,CallLidt
.section .text

start:
  # read machine info, save to 0x8=7c00

  # get mem size(kb)
  movb $0x88,%ah
  int $0x15
  movw %ax,(0x7c00)

  # get video-card data
  movb $0x0f,%ah
  int $0x10
  movw %bx,(0x7c02) # bh = display page
  movw %ax,(0x7c04) # al = video mode, ah = window width

  # check for EGA/VGA and some config paramters
  movb $0x12,%ah
  movb $0x10,%bl
  int $0x10
  movw %ax,(0x7c06)
  movw %bx,(0x7c08)
  movw %cx,(0x7c0a)

  # get hard disk info

initGDT:
  movl gdt_loc,%eax
  # 0
  movl $0x0,0(%eax)
  movl $0x0,4(%eax)
  # 1 code
  movl $0x8000ffff,8(%eax)
  movl $0x00409a00,12(%eax)
  # 2 data
  movl $0x0000ffff,16(%eax)
  movl $0x00cf9200,20(%eax)
  # 3 stack
  movl $0x0000ffff,24(%eax)
  movl $0x00409600,28(%eax)
  cli
  lgdt gdt_size

goPE:
  # turn on A20
  in $0x92,%al
  or $0x02,%al
  out %al,$0x92
  # config CR0
  movl %cr0,%eax
  or $1,%eax
  movl %eax,%cr0
  ljmp $0x8,$(goC-start)

goC:
.align 32
.code32
  movw $0x10,%ax
  movw %ax,%ds
  movw $0x18,%ax
  movw %ax,%ss
  movl 0xffffffff,%esp # !-bug

initPIC:
  # set primary 8259A and slave 8259A
  movb $0x11,%al
  outb %al,$0x20
  outb %al,$0xa0
  # set interrupt from 0x20 to 0x2f (16)
  movb $0x20,%al
  outb %al,$0x21
  movb $0x28,%al
  outb %al,$0xa1
  # connect slave PIC2 to primary
  movb $0x04,%al
  outb %al,$0x21
  movb $0x02,%al
  outb %al,$0xa1
  # open 8086 mode
  movb $0x01,%al
  outb %al,$0x21
  outb %al,$0xa1
  # mask off all interrupts for now
  movb $0xff,%al
  outb %al,$0x21
  outb %al,$0xa1
  lidt ldt_size
  sti

  call SysMain

gdt_size: .word 0x800   # gdt limit = 2048, 256 GDT entries
gdt_loc:  .long 0x20000
ldt_size: .word 0x800   # idt limit = 2048, 256 IDT entries
ldt_loc:  .long 0x21000
