#include "game.h"

void shuffle(int *array, int size)
{
  for (int i = size - 1; i > 0; i--)
  {
    int j = rand() % (i + 1);
    int temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

int small_numbers[10];

void reset_small()
{
  for (int i = 0; i < 10; i++)
  {
    small_numbers[i] = 0;
  }
}

int gen_small()
{
  return (rand() % 10) + 1;
}

const int large_numbers_def[] = {25, 50, 75, 100};
int large_numbers[4];
int large_numbers_index;

void shuffle_large()
{
  memcpy(large_numbers, large_numbers_def, sizeof(large_numbers_def));
  shuffle(large_numbers, 4);
  large_numbers_index = 0;
}

int gen_large()
{
  return large_numbers[large_numbers_index++];
}

int gen_target()
{
  return (rand() % 900) + 100;
}

Game new_game(int small_count, int large_count)
{
  if (large_count > 4)
  {
    large_count = 4;
  }

  if (large_count + small_count != 6)
  {
    small_count = 6 - large_count;
  }

  Game game = {0};

  game.target = gen_target();

  reset_small();

  game.small_count = small_count;
  for (int i = 0; i < small_count; i++)
  {
    int num = gen_small();
    while (small_numbers[num] >= 2)
    {
      num = gen_small();
    }
    small_numbers[num]++;
    game.small[i] = num;
  }

  shuffle_large();

  game.large_count = large_count;
  for (int i = 0; i < large_count; i++)
  {
    game.large[i] = gen_large();
  }

  return game;
}

int score_solution(int solution, int target)
{
  if (target - solution == 0)
  {
    return 10;
  }
  else if (abs(target - solution) <= 5)
  {
    return 7;
  }
  else if (abs(target - solution) <= 10)
  {
    return 5;
  }

  return 0;
}

void print_game(Game game)
{
  printf("Target: %d\n", game.target);
  printf("Numbers: ");
  for (int i = 0; i < game.small_count; i++)
  {
    printf("%d ", game.small[i]);
  }
  for (int i = 0; i < game.large_count; i++)
  {
    printf("%d ", game.large[i]);
  }
  printf("\n");
}