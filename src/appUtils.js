import { LANG, convertFromLastLetter } from "./LANG";
export function getColors(solution, currAnswer) {
  let colors = Array(solution.length).fill("gray");
  let solutionChars = solution.map((char) => convertFromLastLetter(char));
  const currAnsChars = currAnswer.map((char) => convertFromLastLetter(char));
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === " ") continue;
    const currChar = currAnsChars[i];
    const index = solutionChars.indexOf(currChar);
    if (currChar === solution[i]) {
      colors[i] = "green";
      solutionChars.splice(index, 1);
    }
  }

  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === " ") continue;
    const currChar = currAnsChars[i];
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

export function getEmptyAnswer(solution) {
  let answer = [];
  for (let j = 0; j < solution.length; j++) {
    if (solution[j] === " ") answer.push(" ");
    else answer.push("");
  }
  return answer;
}

export function calcStyles(guesses, solution, nGuesses) {
  const allStyles = getDefaultStyles(solution.length, nGuesses);
  for (let i = 0; i < guesses.length; i++) {
    const currStyle = allStyles[i];
    const colors = getColors(solution, guesses[i]);
    for (let j = 0; j < solution.length; j++)
      currStyle[j] = { backgroundColor: colors[j] };
  }
  return allStyles;
}

export const getKeyboardButtonTheme = (guesses, solution) => {
  if (!guesses || guesses.length === 0) return [];
  const charsByColor = { green: [], orange: [], gray: [] };
  for (let i = 0; i < guesses.length; i++) {
    const colors = getColors(solution, guesses[i]);
    for (let j = 0; j < colors.length; j++) {
      const color = colors[j];
      const currChar = convertFromLastLetter(guesses[i][j]);
      charsByColor[color].push(currChar);
    }
  }
  charsByColor["orange"] = charsByColor["orange"].filter(
    (char) => !charsByColor["green"].includes(char)
  );
  charsByColor["gray"] = charsByColor["gray"].filter(
    (char) =>
      !(
        charsByColor["green"].includes(char) ||
        charsByColor["orange"].includes(char)
      )
  );

  const buttonTheme = Object.entries(charsByColor)
    .filter(([key, value]) => value.length > 0)
    .map(([key, value]) => ({
      class: key,
      buttons: value.join(" "),
    }));
  return buttonTheme;
};

export function getDefaultStyles(nSquares, nGuesses) {
  const styles = [];
  for (let i = 0; i < nGuesses; i++) {
    const rowStyles = [];
    for (let j = 0; j < nSquares; j++) {
      rowStyles.push({
        backgroundColor: "white",
      });
    }
    styles.push(rowStyles);
  }

  return styles;
}
export function arraysAreEqual(arr1, arr2) {
  return (
    arr1 &&
    arr2 &&
    arr1.length === arr2.length &&
    arr1.every((element, index) => element === arr2[index])
  );
}

export const textDirection = LANG === "heb" ? "rtl" : "ltr";

export const getLastLetterIndices = (solution) => {
  const lastLetterIndices = [];
  for (let i = solution.length; i >= 0; i--) {
    if (i === 0 || solution[i - 1] === " ") lastLetterIndices.push(i);
  }
  return lastLetterIndices;
};

export const getStringLengths = (arr) => {
  let lengths = [];
  let currentLength = 0;

  for (let char of arr) {
    if (char === " ") {
      if (currentLength > 0) {
        lengths.push(currentLength);
        currentLength = 0;
      }
    } else {
      currentLength++;
    }
  }

  if (currentLength > 0) {
    lengths.push(currentLength);
  }

  return `(${lengths.join(",")})`;
};
export const getUrl = () => {
  return "http://localhost:5000/";
  //return process.env.REACT_APP_URL;
};
