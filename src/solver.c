#include "solver.h"

void evaluate_solution(Solution *solution)
{
  if (solution->op_count == 0)
  {
    solution->score = 1000000;
    solution->current_value = solution->numbers[0];
    return;
  }

  int value = solution->numbers[0];

  for (int i = 0; i < solution->op_count; i++)
  {
    switch (solution->operations[i])
    {
    case ADD:
      if (value > INT_MAX - solution->numbers[i + 1])
      {
        solution->score = 1000000;
        return;
      }
      value += solution->numbers[i + 1];
      break;
    case SUBTRACT:
      if (value < INT_MIN + solution->numbers[i + 1])
      {
        solution->score = 1000000;
        return;
      }
      value -= solution->numbers[i + 1];
      break;
    case MULTIPLY:
      if (solution->numbers[i + 1] != 0 && (value > INT_MAX / solution->numbers[i + 1] || value < INT_MIN / solution->numbers[i + 1]))
      {
        solution->score = 1000000;
        return;
      }
      value *= solution->numbers[i + 1];
      break;
    case DIVIDE:
      if (solution->numbers[i + 1] == 0)
      {
        solution->score = 1000000;
        return;
      }
      value /= solution->numbers[i + 1];
      break;
    case UNKNOWN:
    default:
      return;
    }
  }

  solution->current_value = value;
  solution->score = abs(solution->target - value);
}

Solution search(int *nums_left, int nums_count, Solution last)
{
  Solution best = last;

  if (nums_count == 0 || best.score == 0)
  {
    return best;
  }

  for (int num_index = 0; num_index < nums_count; num_index++)
  {
    for (int op_index = ADD; op_index < DIVIDE; op_index++)
    {
      if (op_index == DIVIDE && nums_left[num_index] == 0)
      {
        continue;
      }

      Solution solution = last;

      solution.numbers[solution.num_count] = nums_left[num_index];
      solution.num_count++;
      solution.operations[solution.op_count] = op_index;
      solution.op_count++;

      evaluate_solution(&solution);

      if (solution.score < best.score)
      {
        best = solution;
        if (best.score == 0)
        {
          return best;
        }
      }

      int next_nums_left[nums_count - 1];
      int k = 0;
      for (int j = 0; j < nums_count; j++)
      {
        if (j != num_index)
        {
          next_nums_left[k++] = nums_left[j];
        }
      }

      Solution recursive_solution = search(next_nums_left, nums_count - 1, solution);

      if (recursive_solution.score < best.score)
      {
        best = recursive_solution;
      }
    }
  }

  return best;
}

Solution solve(Game game)
{
  Solution solution = {0};
  solution.score = 1000000;
  solution.target = game.target;
  solution.current_value = 0;

  int combined_numbers[6];
  memcpy(combined_numbers, game.small, game.small_count * sizeof(int));
  memcpy(combined_numbers + game.small_count, game.large, game.large_count * sizeof(int));

  for (int i = 0; i < 6; i++)
  {
    int nums_left[5];
    int k = 0;
    for (int j = 0; j < 6; j++)
    {
      if (j != i)
      {
        nums_left[k++] = combined_numbers[j];
      }
    }

    Solution new_solution = search(nums_left, 5, solution);

    if (new_solution.score < solution.score)
    {
      solution = new_solution;
    }
  }

  return solution;
}

char operation_to_string(Operation operation)
{
  switch (operation)
  {
  case ADD:
    return '+';
  case SUBTRACT:
    return '-';
  case MULTIPLY:
    return '*';
  case DIVIDE:
    return '/';
  default:
    return '?';
  }
}

void print_solution(Solution solution)
{
  printf("%d ", solution.numbers[0]);
  int running_value = solution.numbers[0];

  for (int i = 0; i < solution.op_count; i++)
  {
    char op = operation_to_string(solution.operations[i]);
    int current_number = solution.numbers[i + 1];

    switch (solution.operations[i])
    {
    case ADD:
      running_value += current_number;
      printf("%c %d ", op, current_number);
      break;
    case SUBTRACT:
      running_value -= current_number;
      printf("%c %d ", op, current_number);
      break;
    case MULTIPLY:
      printf("= %d\n", running_value);
      printf("%d %c %d ", running_value, op, current_number);
      running_value *= current_number;
      break;
    case DIVIDE:
      printf("= %d\n", running_value);
      printf("%d %c %d ", running_value, op, current_number);
      running_value /= current_number;
      break;
    case UNKNOWN:
    default:
      continue;
    }
  }

  printf("= %d\n", solution.current_value);
}
