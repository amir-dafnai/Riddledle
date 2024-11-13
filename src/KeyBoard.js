import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const englishLayout = {
    default: [
      "q w e r t y u i o p {backspace}",
      "a s d f g h j k l {enter}",
      "z x c v b n m",
      
    ],
  };
  
  const hebrewLayout = {
    default: ["ק ר א ט ו ן ם פ {backspace}" ,
    "ש ד ג כ ע י ח ל ך ף {enter}",
    "ז ס ב ה נ מ צ ת ץ"

   ]
  };


export function MyKeyBoard({handleKeyDown , lang}){
    console.log(lang)
    const layout = lang === "ENG" ? englishLayout : hebrewLayout;
    return <Keyboard
            onKeyPress={handleKeyDown} // Attach handler
            layout={layout}
        />
}
