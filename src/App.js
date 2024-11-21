import { useEffect, useState } from "react";
import { setProgress, getProgress } from "./appUtils";

import { LANG } from "./LANG";
import { Game } from "./Game";

const useRiddle = (lang) => {
  const [riddle, setRiddle] = useState(getProgress().riddle || {});
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5000/api/get_riddle?lang=${LANG}&new=${
          riddle === null
        }`
      );
      const data = await response.json();
      if (riddle && riddle.id === data.riddle.id && riddle.lang === lang)
        return;
      setProgress({});
      setRiddle(data.riddle);
    };
    fetchData();
  }, [riddle, lang]); // Empty dependency array ensures this runs only once on mount

  return [riddle, setRiddle];
};

const App = () => {
  const [riddle, setRiddle] = useRiddle(LANG);
  return (
    riddle &&
    riddle.lang === LANG && (
      <Game
        riddle={riddle}
        reset={() => {
          setRiddle(null);
          setProgress({});
        }}
      />
    )
  );
};
export default App;
