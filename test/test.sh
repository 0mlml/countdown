#!/bin/bash
node ../js/cli.js 10 > ./validator.in
go run main.go validator.in
