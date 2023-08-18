#include "solver.h"

#define DEFAULT_RUNS_COUNT 1

int generate_large_count()
{
  return (rand() % 5);
}

int main(int argc, char *argv[])
{
  srand((unsigned int)time(NULL));

  int runs_count = 0;

  if (argc >= 2)
  {
    runs_count = atoi(argv[1]);
    printf("info: count provided, running with no input\n");
  }
  if (runs_count <= 0)
  {
    runs_count = DEFAULT_RUNS_COUNT;
  }

  if (argc == 1)
  {
    printf("info: running interactively\n");
    printf("Enter target:\n");
    char *target_str = malloc(4 * sizeof(char));
    int target;
    int should_validate = 1;
    scanf("%s", target_str);
    if (target_str[3] == 's')
    {
      should_validate = 0;
      target_str[3] = '\0';
    }
    target = atoi(target_str);
    printf("Enter numbers (%%d %%d %%d %%d %%d %%d):\n");
    int nums[6];
    scanf("%d %d %d %d %d %d", &nums[0], &nums[1], &nums[2], &nums[3], &nums[4], &nums[5]);

    Game game = new_set_game(target, nums, should_validate);

    printf("info: New game: \n");
    print_game(game);

    SolutionList solution = solve(game);

    prune_duplicates(&solution);

    printf("info: Found: %d\n", solution.count);
    for (int i = 0; i < solution.count; i++)
    {
      print_solution(solution.found[i]);
    }

    return 0;
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