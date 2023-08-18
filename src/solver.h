#include "game.h"
#include <limits.h>
#include <stdio.h>

typedef enum
{
  UNKNOWN,
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE
} Operation;

typedef struct
{
  int target;
  int score;
  int current_value;
  int num_count;
  int numbers[6];
  int op_count;
  Operation operations[5];
} Solution;

// Try to solve a game
Solution solve(Game game);

// Convert an operation to a string
char operation_to_string(Operation operation);
// Print a solution
void print_solution(Solution solution);