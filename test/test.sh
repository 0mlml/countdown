#!/bin/bash
node ../index.js 10 > ./validator.in
go run main.go validator.in
