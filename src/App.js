import { useEffect, useState } from "react";
import { getUrl } from "./appUtils";
import { setProgress, getProgress, getUserData } from "./localStorageUtils";

import { LANG } from "./LANG";
import { Game } from "./Game";
import { CustomGoogleLogin, GoogleLoginOnGuest } from "./loginPage";

const useRiddle = (lang) => {
  const [riddle, setRiddle] = useState(getProgress().riddle || {});
  useEffect(() => {
    const url = getUrl();
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
  const [logInStatus, setLoginStatus] = useState(null);

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      const loginStatus = storedUser.email ==='guest' ? 'guest' : 'user'
      setLoginStatus(loginStatus);
    }
  }, []);

  if (logInStatus === null)
    return <GoogleLoginOnGuest setLoginStatus={setLoginStatus} />;
  if (riddle)
    return (
      <>
        {logInStatus === 'guest' ? <CustomGoogleLogin setLoginStatus={setLoginStatus} /> : null }
        <Game
          key={riddle.id}
          riddle={riddle}
          reset={() => {
            setRiddle(null);
            setProgress({});
          }}
        />
      </>
    );
};
export default App;
