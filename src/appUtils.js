import { AnimationDelay } from "./Consts";

export function getColors(solution, currAnswer) {
  let colors = Array(solution.length).fill("gray");
  const solutionChars = solution.map((char) => convertFromLastLetter(char));
  const currAnsChars = currAnswer.map((char) => convertFromLastLetter(char));
  for (let i = 0; i < solutionChars.length; i++) {
    if (solutionChars[i] === " ") continue;
    if (currAnsChars[i] === solutionChars[i]) {
      colors[i] = "green";
      solutionChars[i] = "X";
    }
  }

  for (let i = 0; i < solutionChars.length; i++) {
    if (solutionChars[i] === " " || colors[i] === "green") continue;
    const index = solutionChars.indexOf(currAnsChars[i]);
    if (index !== -1) {
      colors[i] = "orange";
      solutionChars[index] = "X";
    }
  }
  return colors;
}

export function getNextSquare(currAnswer) {
  for (let i = currAnswer.length - 1; i >= 0; i--) {
    if (currAnswer[i] === "") return i;
  }
  return null;
}

export function getPrevSquare(currAnswer, solution) {
  let nextSquare = getNextSquare(currAnswer, solution);
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
export const isValidLetter = (value, isLastLetter) => {
  return (
    "אבגדהוזחטיכלמנסעפצקרשת".indexOf(value) !== -1 ||
    ("םןףךץ".indexOf(value) !== -1 && isLastLetter)
  );
};

export const convertToLastLetter = (val) => {
  switch (val) {
    case "צ":
      return "ץ";
    case "פ":
      return "ף";
    case "מ":
      return "ם";
    case "נ":
      return "ן";
    case "כ":
      return "ך";
    default:
      return val;
  }
};

export const convertFromLastLetter = (val) => {
  switch (val) {
    case "ץ":
      return "צ";
    case "ף":
      return "פ";
    case "ם":
      return "מ";
    case "ן":
      return "נ";
    case "ך":
      return "כ";
    default:
      return val;
  }
};

export const getMaxDelay = (solution) => {
  const maxDelay = AnimationDelay * solution.length;
  return maxDelay;
};

export const getTimeDifference = (start, end) => {
  const deltaMs = end - start;
  const totalSeconds = parseInt(Math.floor(deltaMs / 1000), 10);
  const totalMinutes = parseInt(Math.floor(totalSeconds / 60), 10);
  return [totalSeconds, totalMinutes];
};
