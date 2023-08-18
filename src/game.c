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

int gen_small()
{
  return (rand() % 10) + 1;
}

const int numbers_def[] = {25, 50, 75, 100};
int numbers[4];
int numbers_index;

void shuffle_large()
{
  memcpy(numbers, numbers_def, sizeof(numbers_def));
  shuffle(numbers, 4);
  numbers_index = 0;
}

int gen_large()
{
  return numbers[numbers_index++];
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

  Game game = {};

  game.target = gen_target();

  game.small_count = small_count;
  for (int i = 0; i < small_count; i++)
  {
    game.small[i] = gen_small();
  }

  shuffle_large();

  game.large_count = large_count;
  for (int i = 0; i < large_count; i++)
  {
    game.large[i] = gen_large();
  }

  return game;
}

int score_solution(int solution, Game game)
{
  if (game.target - solution == 0)
  {
    return 10;
  }
  else if (abs(game.target - solution) <= 5)
  {
    return 7;
  }
  else if (abs(game.target - solution) <= 10)
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