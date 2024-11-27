import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { isHeb } from "./LANG";

const englishLayout = {
  default: [
    "q w e r t y u i o p {backspace}",
    "a s d f g h j k l {enter}",
    "z x c v b n m",
  ],
};

const hebrewLayout = {
  default: [
    "ק ר א ט ו פ ל {Backspace}",
    "ש ד ג כ ע י ח {Enter}",
    "ז ס ב ה נ מ צ ת",
  ],
};

const layout = isHeb ? hebrewLayout : englishLayout;


export function MyKeyBoard({ handleKeyDown , buttonTheme }) {

  return (
    <div className="my-keyboard">
      <Keyboard
        onKeyPress={handleKeyDown} 
        layout={layout}
        buttonTheme={buttonTheme}
          display={{
            '{Backspace}': '⌫',
            '{Enter}': '↵',
          }}
      />
    </div>
  );
}