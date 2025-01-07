import { useEffect, useState } from "react";
import { getUrl } from "./appUtils";
import { setProgress, getProgress, getUserData } from "./localStorageUtils";

import { Game } from "./Game";
import Navbar from "./Navbar";
import { setGuestUser } from "./loginPage";
import { LOGINSTATUS, VIEWS } from "./Consts";

const useRiddle = () => {
  const [riddle, setRiddle] = useState(getProgress().riddle);
  useEffect(() => {
    const url = getUrl();
    const fetchData = async () => {
      const response = await fetch(`${url}get_riddle?&new=${riddle === null}`);
      const data = await response.json();
      if (riddle && riddle.id === data.riddle.id) return;
      setProgress({});
      setRiddle(data.riddle);
    };
    fetchData();
  }, [riddle]);

  return [riddle, setRiddle];
};

const App = () => {
  const [riddle, setRiddle] = useRiddle();
  const [logInStatus, setLoginStatus] = useState(null);
  const [viewStatus, setViewStatus] = useState(VIEWS.game);

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      const loginStatus = storedUser.email === LOGINSTATUS.guest ? LOGINSTATUS.guest : LOGINSTATUS.user;
      setLoginStatus(loginStatus);
    } else {
      setGuestUser(setLoginStatus);
    }
  }, []);

  if (logInStatus !== null && riddle) {
    return (
      <>
        <Navbar
          isLoggedIn={logInStatus === LOGINSTATUS.user}
          setLoginStatus={setLoginStatus}
          setViewStatus={setViewStatus}
        />
        <Game
          key={riddle.id}
          riddle={riddle}
          reset={() => {
            setRiddle(null);
            setProgress({});
          }}
          viewStatus={viewStatus}
          setViewStatus={setViewStatus}
        />
      </>
    );
  }
};
export default App;
