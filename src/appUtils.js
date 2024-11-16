export function getColors(solution, currAnswer) {
  let colors = Array(solution.length).fill("gray");
  let solutionChars = solution.slice();
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === " ") continue;
    const currChar = currAnswer[i];
    const index = solutionChars.indexOf(currChar);
    if (currChar === solution[i]) {
      colors[i] = "green";
      solutionChars.splice(index, 1);
    }
  }

  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === " ") continue;
    const currChar = currAnswer[i];
    const index = solutionChars.indexOf(currChar);
    if (index !== -1 && colors[i] === "gray") {
      solutionChars.splice(index, 1);
      colors[i] = "orange";
    }
  }
  return colors;
}
export function getNextSquareEnglish(currAnswer) {
  for (let i = 0; i < currAnswer.length; i++) {
    if (currAnswer[i] === "") return i;
  }
  return null;
}
export function getNextSquareHebew(currAnswer) {
  for (let i = currAnswer.length - 1; i >= 0; i--) {
    if (currAnswer[i] === "") return i;
  }
  return null;
}

export function getPrevSquareEnglish(currAnswer, solution) {
  let nextSquare = getNextSquareEnglish(currAnswer, solution);
  if (nextSquare == null) return solution.length - 1;
  nextSquare--;
  if (solution[nextSquare] === " ") return nextSquare - 1;
  return nextSquare;
}

export function getPrevSquareHebrew(currAnswer, solution) {
  let nextSquare = getNextSquareHebew(currAnswer, solution);
  if (nextSquare == null) return 0;
  if (nextSquare === currAnswer.length - 1) return currAnswer.length - 1;
  nextSquare++;
  if (solution[nextSquare] === " ") return nextSquare + 1;
  return nextSquare;
}

export function getEmptyAnswers(solution, numberOfGuesses) {
  let answers = [];
  for (let i = 0; i < numberOfGuesses; i++) {
    let answer = [];
    for (let j = 0; j < solution.length; j++) {
      if (solution[j] === " ") answer.push(" ");
      else answer.push("");
    }
    answers.push(answer);
  }
  return answers;
}
export function getDefaultStyles(nSquares, nGuesses) {
  const singleGuessStyles = Array(nSquares).fill({
    backgroundColor: "white",
  });
  const ans = Array(nGuesses).fill(singleGuessStyles);
  return ans;
}
export function arraysAreEqual(arr1, arr2) {
  return (
    arr1 &&
    arr2 &&
    arr1.length === arr2.length &&
    arr1.every((element, index) => element === arr2[index])
  );
}

export const setProgress = (progress) =>
  localStorage.setItem("progress", JSON.stringify(progress));
export const getProgress = () =>
  JSON.parse(localStorage.getItem("progress") || "{}");
