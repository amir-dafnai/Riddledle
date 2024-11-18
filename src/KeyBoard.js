import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { LANG } from "./LANG";

const englishLayout = {
  default: [
    "q w e r t y u i o p {backspace}",
    "a s d f g h j k l {enter}",
    "z x c v b n m",
  ],
};

const hebrewLayout = {
  default: [
    "ק ר א ט ו ן ם פ {backspace}",
    "ש ד ג כ ע י ח ל ך ף {enter}",
    "ז ס ב ה נ מ צ ת ץ",
  ],
};

const layout = LANG === "ENG" ? englishLayout : hebrewLayout;

export function MyKeyBoard({ handleKeyDown }) {
  return (
    <div className="my-keyboard">
      <Keyboard
        onKeyPress={handleKeyDown} 
        layout={layout}
      />
    </div>
  );
}
