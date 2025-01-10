import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { getColors, convertFromLastLetter } from "./appUtils";

const layout = {
  default: [
    "ק ר א ט ו פ ל {Backspace}",
    "ש ד ג כ ע י ח {Enter}",
    "ז ס ב ה נ מ צ ת",
  ],
};

export function MyKeyBoard({ handleKeyDown, buttonTheme }) {
  return (
    <Keyboard
      onKeyPress={handleKeyDown}
      layout={layout}
      theme={"hg-theme-default hg-layout-default myTheme"}
      buttonTheme={buttonTheme}
      display={{
        "{Backspace}": "⌫",
        "{Enter}": "⏎",
      }}
    />
  );
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
