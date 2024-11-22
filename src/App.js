import { useEffect, useState } from "react";
import { setProgress, getProgress } from "./appUtils";

import { LANG } from "./LANG";
import { Game } from "./Game";

const get_url = ()=>{
  //return http://localhost:5000
  return process.env.REACT_APP_URL
}

const useRiddle = (lang) => {
  const [riddle, setRiddle] = useState(getProgress().riddle || {});
  useEffect(() => {
    console.log('fetching')
    const url = get_url(); 
    const fetchData = async () => {
      const response = await fetch(
        `${url}/api/get_riddle?lang=${LANG}&new=${riddle === null}`
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
        key={riddle.id}
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
