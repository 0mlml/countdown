CC = gcc
CFLAGS = -Wall
SRCS = $(wildcard src/*.c)
TARGET = program

all: $(TARGET)

$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) $(SRCS) -o $@

run:
	$(MAKE) $(TARGET)
	./$(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: run $(TARGET)