# Countdown Numbers Game

A web implementation of the famous numbers game from the TV show Countdown. The numbers game is one of the challenges presented to contestants in the Countdown TV show. 

## Game Overview

In the numbers game of Countdown:

1. **Numbers Selection**: 
   - The contestant chooses six numbers from two groups: four "large" numbers (25, 50, 75, and 100) and twenty "small" numbers (two each of numbers from 1 through 10).
   - The contestant specifies how many numbers they want from the "large" group (between none and all four), with the remainder coming from the "small" group to make up six numbers in total.

2. **Target Number**:
   - A random three-digit target number is then generated.
   - The goal of the game is to use arithmetic operations (addition, subtraction, multiplication, and division) on the chosen numbers to come as close as possible to the target number, ideally hitting it exactly.
   - Each of the six chosen numbers can be used only once. Intermediate results from combining two or more numbers can be used in subsequent calculations, but only once as well.

3. **Scoring Overview**:
   - **Exact Match**: If the contestant or the solver achieves the exact target number, they score 10 points.
   - **Close Proximity**: If the solution is within 1 to 5 away from the target, they score 7 points. Solutions between 6 to 10 away from the target score 5 points.
   - **Beyond 10 Away**: Solutions that are more than 10 away from the target score 0 points. 
   
   Note: This solver identifies all possible solutions that would score points.

## Live Demo

Visit [www.mlml.dev/countdown](https://www.mlml.dev/countdown) for a live demonstration.


## Usage

 - **Automatic Generation**: 
   - Go to the website and simply click the \`Generate Numbers\` button. 
   - This will generate both the target number and the list of numbers you can use based on your specified preferences (i.e., the number of large and small numbers).

- **Manual Input**:
   - You can modify the numbers directly in the text areas if you want to set specific numbers or targets.
   - After inputting your desired numbers, click the \`Solve\` button.

 - **Solving**:
   - Once you've got your numbers, either through automatic generation or manual input, click the \`Solve\` button.
   - The solver will attempt to find solutions and display them in the "Solver Output" text area.

## License

This project is open-source and available under the [MIT License](LICENSE).
