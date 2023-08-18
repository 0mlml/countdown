#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef struct
{
  int target;
  int small_count;
  int small[6];
  int large_count;
  int large[4];
} Game;

// Shuffle an array (https://en.wikipedia.org/wiki/Fisher-Yates_shuffle)
void shuffle(int *array, int size);

// Seed the RNG
void init_rng();
// Generate a number 1-10
int gen_small();
// Shuffle the large number array
void shuffle_large();
// Generate a number 25, 50, 75, or 100. Call shuffle_large() first.
int gen_large();
// Generate a three digit target
int gen_target();

// Generate a new game
Game new_game(int small_count, int large_count);
// Print a game
void print_game(Game game);
// Score a solution number
int score_solution(int solution, Game game);