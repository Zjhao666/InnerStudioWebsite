
#ifndef INPUT_H
#define INPUT_H

#define KEY_ESC                        0X01        // ESC
#define KEY_1                          0X02        // 1
#define KEY_2                          0X03        // 2
#define KEY_3                          0X04        // 3
#define KEY_4                          0X05        // 4
#define KEY_5                          0X06        // 5
#define KEY_6                          0X07        // 6
#define KEY_7                          0X08        // 7
#define KEY_8                          0X09        // 8
#define KEY_9                          0X0A        // 9
#define KEY_0                          0X0B        // 0
#define KEY_DASH                       0X0C        // -
#define KEY_EQUAL                      0X0D        // =
#define KEY_BACKSPACE                  0X0E        // BACKSPACE
#define KEY_TAB                        0X0F        // TAB
#define KEY_Q                          0X10        // Q
#define KEY_W                          0X11        // W
#define KEY_E                          0X12        // E
#define KEY_R                          0X13        // R
#define KEY_T                          0X14        // T
#define KEY_Y                          0X15        // Y
#define KEY_U                          0X16        // U
#define KEY_I                          0X17        // I
#define KEY_O                          0X18        // O
#define KEY_P                          0X19        // P
#define KEY_LBRACKET                   0X1A        // [
#define KEY_RBRACKET                   0X1B        // ]
#define KEY_ENTER                      0X1C        // ENTER
#define KEY_CTRL                       0X1D        // CTRL
#define KEY_A                          0X1E        // A
#define KEY_S                          0X1F        // S
#define KEY_D                          0X20        // D
#define KEY_F                          0X21        // F
#define KEY_G                          0X22        // G
#define KEY_H                          0X23        // H
#define KEY_J                          0X24        // J
#define KEY_K                          0X25        // K
#define KEY_L                          0X26        // L
#define KEY_SEMICOLON                  0X27        // ;
#define KEY_RQUOTE                     0X28        // '
#define KEY_LQUOTE                     0X29        // `
#define KEY_LEFT_SHIFT                 0X2A        // LEFT SHIFT
#define KEY_BACKSLASH                  0X2B        // '\'
#define KEY_Z                          0X2C        // Z
#define KEY_X                          0X2D        // X
#define KEY_C                          0X2E        // C
#define KEY_V                          0X2F        // V
#define KEY_B                          0X30        // B
#define KEY_N                          0X31        // N
#define KEY_M                          0X32        // M
#define KEY_COMMA                      0X33        // ,
#define KEY_PERIOD                     0X34        // .
#define KEY_SLASH                      0X35        // /
#define KEY_RIGHT_SHIFT                0X36        // RIGHT SHIFT
#define KEY_PRTSC                      0X37        // PRINT SCREEN
#define KEY_ALT                        0X38        // ALT
#define KEY_SPACE                      0X39        // SPACE
#define KEY_CAPS_LOCK                  0X3A        // CAPS LOCK
#define KEY_F1                         0X3B        // F1
#define KEY_F2                         0X3C        // F2
#define KEY_F3                         0X3D        // F3
#define KEY_F4                         0X3E        // F4
#define KEY_F5                         0X3F        // F5
#define KEY_F6                         0X40        // F6
#define KEY_F7                         0X41        // F7
#define KEY_F8                         0X42        // F8
#define KEY_F9                         0X43        // F9
#define KEY_F10                        0X44        // F10
#define KEY_NUM_LOCK                   0X45        // NUM LOCK
#define KEY_SCROLL_LOCK                0X46        // SCROLL LOCK
#define KEY_HOME                       0X47        // HOME
#define KEY_UP                         0X48        // UP
#define KEY_PAGE_UP                    0X49        // PAGE UP
#define KEY_SUB                        0X4A        // SUB
#define KEY_LEFT                       0X4B        // LEFT
#define KEY_CENTER                     0X4C        // CENTER
#define KEY_RIGHT                      0X4D        // RIGHT
#define KEY_ADD                        0X4E        // ADD
#define KEY_END                        0X4F        // END
#define KEY_DOWN                       0X50        // DOWN
#define KEY_PAGE_DOWN                  0X51        // PAGE DOWN
#define KEY_INSERT                     0X52        // INSERT
#define KEY_DEL                        0X53        // DEL

#include "asm.h"

char keys[0x53][2] = {
  { 0x0, 0x0 },        // ESC
  { '1', '!' },        // 1
  { '2', '@' },        // 2
  { '3', '#' },        // 3
  { '4', '$' },        // 4
  { '5', '%' },        // 5
  { '6', '^' },        // 6
  { '7', '&' },        // 7
  { '8', '*' },        // 8
  { '9', '(' },        // 9
  { '0', ')' },        // 0
  { '-', '_' },        // -
  { '=', '+' },        // =
  { 0x0, 0x0 },        // BACKSPACE
  { 0x0, 0x0 },        // TAB
  { 'q', 'Q' },        // Q
  { 'w', 'W' },        // W
  { 'e', 'E' },        // E
  { 'r', 'R' },        // R
  { 't', 'T' },        // T
  { 'y', 'Y' },        // Y
  { 'u', 'U' },        // U
  { 'i', 'I' },        // I
  { 'o', 'O' },        // O
  { 'p', 'P' },        // P
  { '[', '{' },        // [
  { ']', '}' },        // ]
  { '\n', 0x0 },       // ENTER
  { 0x0, 0x0 },        // CTRL
  { 'a', 'A' },        // A
  { 's', 'S' },        // S
  { 'd', 'D' },        // D
  { 'f', 'F' },        // F
  { 'g', 'G' },        // G
  { 'h', 'H' },        // H
  { 'j', 'J' },        // J
  { 'k', 'K' },        // K
  { 'l', 'L' },        // L
  { ';', ':' },        // ;
  { '\'', '"' },       // '
  { '`', '~' },        // `
  { 0x0, 0x0 },        // LEFTSHIFT
  { '\\', '|' },       // '\'
  { 'a', 'Z' },        // Z
  { 'x', 'X' },        // X
  { 'c', 'C' },        // C
  { 'v', 'V' },        // V
  { 'b', 'B' },        // B
  { 'n', 'N' },        // N
  { 'm', 'M' },        // M
  { ',', '<' },        // ,
  { '.', '>' },        // .
  { '/', '?' },        // /
  { 0x0, 0x0 },        // RIGHTSHIFT
  { 0x0, 0x0 },        // PRINTSCREEN
  { 0x0, 0x0 },        // ALT
  { 0x0, 0x0 },        // SPACE
  { 0x0, 0x0 },        // CAPSLOCK
  { 0x0, 0x0 },        // F1
  { 0x0, 0x0 },        // F2
  { 0x0, 0x0 },        // F3
  { 0x0, 0x0 },        // F4
  { 0x0, 0x0 },        // F5
  { 0x0, 0x0 },        // F6
  { 0x0, 0x0 },        // F7
  { 0x0, 0x0 },        // F8
  { 0x0, 0x0 },        // F9
  { 0x0, 0x0 },        // F10
  { 0x0, 0x0 },        // NUMLOCK
  { 0x0, 0x0 },        // SCROLLLOCK
  { 0x0, 0x0 },        // HOME
  { 0x0, 0x0 },        // UP
  { 0x0, 0x0 },        // PAGEUP
  { 0x0, 0x0 },        // SUB
  { 0x0, 0x0 },        // LEFT
  { 0x0, 0x0 },        // CENTER
  { 0x0, 0x0 },        // RIGHT
  { 0x0, 0x0 },        // ADD
  { 0x0, 0x0 },        // END
  { 0x0, 0x0 },        // DOWN
  { 0x0, 0x0 },        // PAGEDOWN
  { 0x0, 0x0 },        // INSERT
  { 0x0, 0x0 }         // DEL
};

void intKeyboard(){
  // get scan code
  unsigned char scan_code;
  asm_inb(0x60);
  // index of scan code
  unsigned char key_ind = scan_code & 0x7f;
  // shift pressed
  static unsigned char kb_key_shift = 0x0;
  static unsigned char word_x=0;
  word_x++;
  // highest bit of keyboard, 0 = down, 1 = up
  if ((key_ind == KEY_LEFT_SHIFT || key_ind == KEY_RIGHT_SHIFT) && ((scan_code & 0x80) == 0x00)){
    kb_key_shift = 0x1;
    puts("shift down: ");
  }
  // shift down
  else if ((key_ind == KEY_LEFT_SHIFT || key_ind == KEY_RIGHT_SHIFT) && ((scan_code & 0x80) == 0x80)){
    kb_key_shift = 0x0;
    puts("shift up: ");
  }
  // display character
  if (((scan_code & 0x80) == 0x80)){
    putc(keys[key_ind-1][kb_key_shift]);
  }
  // clear keyboard status to accept new key event, without clear shift position
  asm_outb(scan_code & 0x7f, 0x61);
  // notify PIC to allow interrupt
  asm_outb(0x20, 0x20);
}

#endif
