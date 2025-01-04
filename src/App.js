import { useEffect, useState } from "react";
import { getUrl } from "./appUtils";
import { setProgress, getProgress, getUserData } from "./localStorageUtils";

import { Game } from "./Game";
import { CustomGoogleLogin, GoogleLoginOnGuest } from "./loginPage";

const useRiddle = () => {
  const [riddle, setRiddle] = useState(getProgress().riddle || {});
  useEffect(() => {
    const url = getUrl();
    const fetchData = async () => {
      const response = await fetch(
        `${url}api/get_riddle?&new=${riddle === null}`
      );
      const data = await response.json();
      if (riddle && riddle.id === data.riddle.id)
        return;
      setProgress({});
      setRiddle(data.riddle);
    };
    fetchData();
  }, [riddle]); // Empty dependency array ensures this runs only once on mount

  return [riddle, setRiddle];
};

const App = () => {
  const [riddle, setRiddle] = useRiddle();
  const [logInStatus, setLoginStatus] = useState(null);

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      const loginStatus = storedUser.email === "guest" ? "guest" : "user";
      setLoginStatus(loginStatus);
    }
  }, []);

  if (logInStatus === null)
    return <GoogleLoginOnGuest setLoginStatus={setLoginStatus} />;
  if (riddle)
    return (
      <>
        {logInStatus === "guest" ? (
          <CustomGoogleLogin setLoginStatus={setLoginStatus} />
        ) : null}
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
