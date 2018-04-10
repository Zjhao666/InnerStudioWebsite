
run: loader.bin
	dd if=$(BIN_DIR)/loader.bin of=$(BIN_DIR)/os.img bs=512 count=1
	dd if=$(BIN_DIR)/system.bin of=$(BIN_DIR)/system.img bs=1474048 count=1 conv=sync
	dd if=$(BIN_DIR)/system.img of=$(BIN_DIR)/os.img bs=512 seek=1
	# qemu-system-i386 -fda $(BIN_DIR)/os.img -boot a
	# qemu-system-i386 -fda $(BIN_DIR)/os.img -boot a -gdb tcp::1234 -monitor stdio -S
	qemu-system-i386 -fda $(BIN_DIR)/os.img -boot a -gdb tcp::1234 -monitor stdio

loader.bin: loader.o Makefile loader.lds
	ld -M --oformat binary -m elf_i386 -o $(BIN_DIR)/loader.bin $(OBJ_DIR)/loader.o -T loader.lds

loader.o: loader.s Makefile
	as --32 loader.s -o $(OBJ_DIR)/loader.o
