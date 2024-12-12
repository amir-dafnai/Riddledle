import { useEffect, useState } from "react";
import { get_url } from "./appUtils";
import { setProgress, getProgress, getUserData } from "./localStorageUtils";

import { LANG } from "./LANG";
import { Game } from "./Game";
import { CustomGoogleLogin } from "./loginPage";

const useRiddle = (lang) => {
  const [riddle, setRiddle] = useState(getProgress().riddle || {});
  useEffect(() => {
    const url = get_url();
    const fetchData = async () => {
      const response = await fetch(
        `${url}api/get_riddle?lang=${LANG}&new=${riddle === null}`
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) return <CustomGoogleLogin setIsLoggedIn={setIsLoggedIn} />;
  if (riddle)
    return (
      <Game
        key={riddle.id}
        riddle={riddle}
        reset={() => {
          setRiddle(null);
          setProgress({});
        }}
      />
    );
};
export default App;
