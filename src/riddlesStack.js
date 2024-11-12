const englishRiddles = [
  ["Guess The Word", "maple"],
  ["Guess the color", "Green"],
  ["Guess the car", "mitsubishi"],
  ["Guess the fruit", "watermelon"],
  ["Guess the problem", "low power"],
];

const hebrewRiddles = [["שריפה משני תווים", "מדורה"], ["בלה בלה", "בלה בלה"] , ["מאבק אלים זה אלפית מהשמש", "מלחמה" ]];

export function getRandomEnglishRiddle() {
  const randomIndex = Math.floor(Math.random() * englishRiddles.length);
  const [definition, solution] = englishRiddles[randomIndex];
  return { definition: definition, solution: solution.toUpperCase().split("") };
}
export function getRandomHebrewRiddle() {
  const randomIndex = Math.floor(Math.random() * hebrewRiddles.length);
  let [definition, solution] = hebrewRiddles[randomIndex];
  solution = solution.split("").reverse();
  console.log("solution is", solution);
  return { definition: definition, solution: solution };
}
