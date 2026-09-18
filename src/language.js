import { LANGUAGES } from "./Consts";

// Everything that differs between a Hebrew riddle and an English one lives
// here or takes a `language` argument. The rest of the game — guessing,
// colouring, stats, the group flow — is identical for both.

export const getLanguage = (riddle) =>
  (riddle && riddle.language) || LANGUAGES.hebrew;

export const isEnglish = (language) => language === LANGUAGES.english;

// Hebrew reads right-to-left; the solution the server sends is already in
// display (left-to-right) order for both languages, so this only affects the
// text around the board and the order the squares are filled in.
export const getDirection = (language) => (isEnglish(language) ? "ltr" : "rtl");

// English guesses are compared case-insensitively and the board is uppercase,
// so solutions are normalised once, when a riddle group arrives, rather than at
// every comparison.
export const normalizeRiddle = (riddle) =>
  isEnglish(getLanguage(riddle))
    ? { ...riddle, solution: riddle.solution.map((c) => c.toUpperCase()) }
    : riddle;

export const normalizeRiddleGroup = (riddleGroup) =>
  riddleGroup && riddleGroup.group
    ? { ...riddleGroup, group: riddleGroup.group.map(normalizeRiddle) }
    : riddleGroup;

export const normalizeLetter = (letter, language) =>
  isEnglish(language) ? letter.toUpperCase() : letter;
