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
      value += solution->numbers[i + 1];
      break;
    case SUBTRACT:
      value -= solution->numbers[i + 1];
      break;
    case MULTIPLY:
      value *= solution->numbers[i + 1];
      break;
    case DIVIDE:
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

#define MAX_SOLUTIONS 100

Solution *found_solution;
int found_solution_count;

Solution search(int *nums_left, int nums_count, Solution last)
{
  Solution best = last;

  if (nums_count <= 0 || best.score == 0)
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

      if (solution.num_count == 6 || solution.op_count == 5)
      {
        return best;
      }

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
          if (found_solution_count <= MAX_SOLUTIONS)
          {
            found_solution[found_solution_count++] = best;
            return best;
          }
        }
      }

      int *next_nums_left = malloc((nums_count - 1) * sizeof(int));
      if (next_nums_left == NULL)
      {
        printf("Failed to allocate memory for next_nums_left\n");
        exit(1);
      }

      int k = 0;
      for (int j = 0; j < nums_count; j++)
      {
        if (j != num_index)
        {
          next_nums_left[k++] = nums_left[j];
        }
      }

      Solution recursive_solution = search(next_nums_left, nums_count - 1, solution);

      free(next_nums_left);

      if (recursive_solution.score < best.score)
      {
        best = recursive_solution;
      }
    }
  }

  return best;
}

SolutionList solve(Game game)
{
  Solution solution = {0};
  solution.current_value = 0;
  solution.num_count = 0;
  solution.op_count = 0;
  solution.score = 1000000;
  solution.target = game.target;

  int combined_numbers[6];
  memcpy(combined_numbers, game.small, game.small_count * sizeof(int));
  memcpy(combined_numbers + game.small_count, game.large, game.large_count * sizeof(int));

  found_solution = malloc(sizeof(Solution) * MAX_SOLUTIONS);
  found_solution_count = 0;

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

  if (found_solution_count <= 0 && score_solution(solution.current_value, solution.target) > 0)
  {
    found_solution[found_solution_count++] = solution;
  }

  return (SolutionList){found_solution, found_solution_count};
}

int are_solutions_equal(Solution *a, Solution *b)
{
  if (a->current_value != b->current_value)
  {
    return 0;
  }

  for (int i = 0; i < 6; i++)
  {
    if (a->numbers[i] != b->numbers[i])
    {
      return 0;
    }
  }

  for (int i = 0; i < 5; i++)
  {
    if (a->operations[i] != b->operations[i])
    {
      return 0;
    }
  }

  return 1;
}

void prune_duplicates(SolutionList *list)
{
  for (int i = 0; i < list->count; i++)
  {
    for (int j = i + 1; j < list->count;)
    {
      if (are_solutions_equal(&list->found[i], &list->found[j]))
      {
        for (int k = j; k < list->count - 1; k++)
        {
          list->found[k] = list->found[k + 1];
        }
        list->count--;
      }
      else
      {
        j++;
      }
    }
  }
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
  if (solution.op_count == 0 || solution.num_count == 0)
  {
    printf("Solution is invalid\n");
    return;
  }

  int need_parenthesis = 0;
  if (solution.operations[0] == ADD || solution.operations[0] == SUBTRACT)
  {
    need_parenthesis = 1;
  }

  if (need_parenthesis)
  {
    printf("(");
  }

  int num_index = 0;
  int op_index = 0;
  while (op_index < solution.op_count && num_index < solution.num_count)
  {
    printf("%d", solution.numbers[num_index++]);
    if (!solution.numbers[num_index])
    {
      break;
    }
    char op_char = operation_to_string(solution.operations[op_index]);
    if ((op_char == '*' || op_char == '/') && need_parenthesis)
    {
      printf(") %c ", op_char);
      need_parenthesis = 0;
    }
    else
    {
      printf(" %c ", op_char);
    }
    op_index++;
  }

  if (num_index < solution.num_count)
  {
    printf("%d", solution.numbers[num_index]);
  }

  if (need_parenthesis)
  {

    printf(")");
  }

  printf(" = %d\n", solution.current_value);
}
