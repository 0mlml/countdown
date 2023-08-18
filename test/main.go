package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func evalWithBC(equation string) (int, error) {
	cmd := exec.Command("bc", "-l")
	cmd.Stdin = strings.NewReader(equation + "\n")
	out, err := cmd.Output()
	if err != nil {
		return 0, err
	}

	var result int
	_, err = fmt.Sscanf(string(out), "%d", &result)
	return result, err
}

func validateEquation(equation string) (bool, int) {
	parts := strings.Split(equation, "=")
	if len(parts) != 2 {
		return false, 0
	}

	leftValue, err := evalWithBC(parts[0])
	if err != nil {
		fmt.Println("Error evaluating:", err)
		return false, 0
	}

	rightValue, err := evalWithBC(parts[1])
	if err != nil {
		fmt.Println("Error evaluating:", err)
		return false, 0
	}

	return leftValue == rightValue, leftValue
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Please provide a file name.")
		return
	}

	file, err := os.Open(os.Args[1])
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	lineNumber := 1
	correct := 0
	incorrect := 0
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "info: ") {
			lineNumber++
			continue
		}
		valid, conrrectAns := validateEquation(line)
		if valid {
			// fmt.Printf("Line %d: %s is VALID\n", lineNumber, line)
			correct++
		} else {
			fmt.Printf("Line %d: %s is INVALID Should be: %d\n", lineNumber, line, conrrectAns)
			incorrect++
		}
		lineNumber++
	}

	fmt.Printf("Total incorrect: %d/%d\n", incorrect, correct+incorrect)

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading file:", err)
	}
}
