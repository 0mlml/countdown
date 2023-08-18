#!/bin/bash
cd ..
make
cd test
../countdown.out 10 > ./validator.in
go run main.go validator.in
