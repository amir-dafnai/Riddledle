import {
  getColors,
  getEmptyAnswer,
  getNextSquare,
  getPrevSquare,
  getLastLetterIndices,
  isValidLetter,
} from "./appUtils";
import { LANGUAGES } from "./Consts";
import { normalizeRiddle } from "./language";

const HE = LANGUAGES.hebrew;
const EN = LANGUAGES.english;

// Types a whole word into an empty board the way Game.js does, and returns the
// squares in the order they are rendered (left to right).
const type = (solution, letters, language) => {
  let answer = getEmptyAnswer(solution);
  for (const letter of letters) {
    const square = getNextSquare(answer, language);
    answer = answer.map((v, i) => (i === square ? letter : v));
  }
  return answer;
};

describe("square fill order", () => {
  test("hebrew fills right to left", () => {
    // Server sends the solution reversed, so display order is מ,ו,ל,ש.
    const solution = [..."שלום"].reverse();
    expect(type(solution, "שלום", HE)).toEqual([..."שלום"].reverse());
  });

  test("english fills left to right", () => {
    expect(type([..."ENTER"], "ENTER", EN)).toEqual([..."ENTER"]);
  });

  test("english board is full once every letter is typed", () => {
    expect(getNextSquare(type([..."ENTER"], "ENTER", EN), EN)).toBeNull();
  });

  test("english fills around a space", () => {
    const solution = [..."NO ONE"];
    expect(type(solution, "NOONE", EN).join("")).toBe("NO ONE");
  });
});

describe("backspace", () => {
  test("english clears the last letter typed", () => {
    const solution = [..."ENTER"];
    const answer = type(solution, "ENT", EN);
    expect(getPrevSquare(answer, solution, EN)).toBe(2); // the T
  });

  test("english clears the last square when the board is full", () => {
    const solution = [..."ENTER"];
    expect(getPrevSquare(type(solution, "ENTER", EN), solution, EN)).toBe(4);
  });

  test("english stays put on an empty board", () => {
    const solution = [..."ENTER"];
    expect(getPrevSquare(getEmptyAnswer(solution), solution, EN)).toBe(0);
  });

  test("english skips back over a space", () => {
    const solution = [..."NO ONE"];
    const answer = type(solution, "NOO", EN); // N,O in 0,1 and O in 3
    expect(getPrevSquare(answer, solution, EN)).toBe(3);
  });

  test("hebrew is unchanged", () => {
    const solution = [..."שלום"].reverse();
    const answer = type(solution, "של", HE);
    expect(getPrevSquare(answer, solution, HE)).toBe(2);
  });
});

describe("letters", () => {
  test("english accepts a-z in either case, rejects hebrew", () => {
    expect(isValidLetter("a", false, EN)).toBe(true);
    expect(isValidLetter("Z", false, EN)).toBe(true);
    expect(isValidLetter("ש", false, EN)).toBe(false);
    expect(isValidLetter("1", false, EN)).toBe(false);
  });

  test("hebrew still rejects latin letters", () => {
    expect(isValidLetter("a", false, HE)).toBe(false);
    expect(isValidLetter("ש", false, HE)).toBe(true);
  });

  test("english has no final-letter squares", () => {
    expect(getLastLetterIndices([..."ENTER"], EN)).toEqual([]);
    expect(getLastLetterIndices([..."שלום"], HE).length).toBeGreaterThan(0);
  });
});

describe("colours", () => {
  test("english colours by position", () => {
    // ENTER vs EATER: only the A is absent, the T already sits in place.
    expect(getColors([..."ENTER"], [..."EATER"])).toEqual([
      "green", "gray", "green", "green", "green",
    ]);
  });

  test("a repeated letter is only credited once", () => {
    // RICE has a single E, so only the first E of EERY goes orange.
    expect(getColors([..."RICE"], [..."EERY"])).toEqual([
      "orange", "gray", "orange", "gray",
    ]);
  });
});

describe("normalizeRiddle", () => {
  test("uppercases an english solution", () => {
    const riddle = { solution: [..."Which"], language: EN };
    expect(normalizeRiddle(riddle).solution).toEqual([..."WHICH"]);
  });

  test("leaves a hebrew solution alone", () => {
    const riddle = { solution: [..."שלום"], language: HE };
    expect(normalizeRiddle(riddle).solution).toEqual([..."שלום"]);
  });

  test("treats a riddle with no language as hebrew", () => {
    const riddle = { solution: [..."שלום"] };
    expect(normalizeRiddle(riddle).solution).toEqual([..."שלום"]);
  });
});
