
system.bin: system.o Makefile system.lds main.o
	ld -M -m elf_i386 -o $(BIN_DIR)/system.elf $(OBJ_DIR)/system.o $(OBJ_DIR)/main.o -T system.lds
	objcopy -O binary $(BIN_DIR)/system.elf $(BIN_DIR)/system.bin

system.o: system.s Makefile
	as --32 system.s -o $(OBJ_DIR)/system.o

main.o: main.c Makefile
	gcc -c main.c -o $(OBJ_DIR)/main.o -m32 -L include -fno-stack-protector
