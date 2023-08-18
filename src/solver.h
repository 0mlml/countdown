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

typedef struct
{
  Solution *found;
  int count;
} SolutionList;

// Try to solve a game
SolutionList solve(Game game);

// Prune duplicate solutions
void prune_duplicates(SolutionList *list);
// Print a solution
void print_solution(Solution solution);