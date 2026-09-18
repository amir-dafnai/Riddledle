import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { getColors, convertFromLastLetter } from "./appUtils";
import { useState } from "react";
import { LANGUAGES } from "./Consts";
import { isEnglish } from "./language";
import "./Keyboard.css"; // Add custom CSS here

const LAYOUTS = {
  [LANGUAGES.hebrew]: {
    default: [
      "ק ר א ט ו פ ל {Backspace}",
      "ש ד ג כ ע י ח {Enter}",
      "ז ס ב ה נ מ צ ת",
    ],
  },
  // Uppercase to match the board and the colours, which key off the uppercased
  // guess letters.
  [LANGUAGES.english]: {
    default: [
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "{Enter} Z X C V B N M {Backspace}",
    ],
  },
};

const getLayout = (language) =>
  isEnglish(language) ? LAYOUTS[LANGUAGES.english] : LAYOUTS[LANGUAGES.hebrew];

const getPressedKeyTheme = (pressedKey) => {
  return pressedKey
    ? [
        {
          class: "pressed",
          buttons: pressedKey,
        },
      ]
    : [];
};

export function MyKeyBoard({ handleKeyDown, buttonTheme, language }) {
  const [pressedKey, setPressedKey] = useState("");

  const onKeyPress = (button) => {
    handleKeyDown(button);

    if (navigator.vibrate) {
      navigator.vibrate([1, 20, 1]); 
    }
    setPressedKey(button);

    // Remove the highlight after a short delay
    setTimeout(() => setPressedKey(""), 200);
  };
  const pressedKeyTheme = getPressedKeyTheme(pressedKey)
  return (
    <Keyboard
      onKeyPress={onKeyPress}
      layout={getLayout(language)}
      theme={"hg-theme-default hg-layout-default myTheme"}
      buttonTheme={[...buttonTheme, ...pressedKeyTheme]}
      display={{
        "{Backspace}": "⌫",
        "{Enter}": "⏎",
      }}
    />
  );
}

const getCharsByColors = (guesses, solution)=>{
  const charsByColor = { green: [], orange: [], gray: [] };
  if (!guesses || guesses.length === 0) return charsByColor;
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
  return charsByColor


}

export const getKeyboardButtonTheme = (guesses, solution, currAnswer) => {
  const charsByColor = getCharsByColors(guesses , solution)
  const buttonTheme = Object.entries(charsByColor)
    .filter(([key, value]) => value.length > 0)
    .map(([key, value]) => ({
      class: key,
      buttons: value.join(" "),
    }));
  if (currAnswer.filter(c=>c!=='').length >= solution.length){
    buttonTheme.push({
      class: "pump",
      buttons: "{Enter}",
    })
  }
  return buttonTheme;
};
