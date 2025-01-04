import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";


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
