#include "game.h"
#include <stdio.h>

#define DEFAULT_RUNS_COUNT 10

int generate_large_count()
{
  return (rand() % 4) + 1;
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

  for (int run_index = 0; run_index < runs_count; run_index++)
  {
    int large_count = generate_large_count();
    int small_count = 6 - large_count;

    Game game = new_game(small_count, large_count);

    print_game(game);
  }

  return 0;
}