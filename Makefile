CC = gcc
GDB = gdb
CFLAGS = -Wall
DFLAGS = -g -O0
SRCS = $(wildcard src/*.c)
TARGET = countdown.out

all: $(TARGET)

$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) $(SRCS) -o $@

debug: $(SRCS)
	$(CC) $(CFLAGS) $(DFLAGS) $(SRCS) -o $(TARGET)
	$(GDB) $(TARGET)

run:
	$(MAKE) $(TARGET)
	./$(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: run $(TARGET)