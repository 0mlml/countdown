#include "solver.h"
#include <stdio.h>

#define DEFAULT_RUNS_COUNT 1

int generate_large_count()
{
  return (rand() % 5);
}

int main(int argc, char *argv[])
{
  srand((unsigned int)time(NULL));

  int runs_count = 0;

  if (argc == 2)
  {
    runs_count = atoi(argv[1]);
  }
  if (runs_count <= 0)
  {
    runs_count = DEFAULT_RUNS_COUNT;
  }
  Game game;
  SolutionList solution;
  for (int run_index = 0; run_index < runs_count; run_index++)
  {
    int large_count = generate_large_count();
    int small_count = 6 - large_count;

    game = new_game(small_count, large_count);

    printf("info: New game: \n");

    print_game(game);

    solution = solve(game);

    prune_duplicates(&solution);

    printf("info: Found: %d\n", solution.count);
    for (int i = 0; i < solution.count; i++)
    {
      print_solution(solution.found[i]);
    }
  }

  return 0;
}