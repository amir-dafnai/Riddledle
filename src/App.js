import { useEffect, useState } from "react";
import { getUrl } from "./appUtils";
import { setProgress, getProgress, getUserData } from "./localStorageUtils";

import { Game } from "./Game";
import Navbar from "./Navbar";

const useRiddle = () => {
  const [riddle, setRiddle] = useState(getProgress().riddle);
  useEffect(() => {
    const url = getUrl();
    const fetchData = async () => {
      const response = await fetch(
        `${url}api/get_riddle?&new=${riddle === null}`
      );
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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      const loginStatus = storedUser.email === "guest" ? "guest" : "user";
      setLoginStatus(loginStatus);
    } else {
      setLoginStatus("guest");
    }
  }, []);

  if (logInStatus !== null && riddle) {
    console.log('1', logInStatus)
    console.log('2', riddle)
    return (
      <>
        <Navbar setLoginStatus={setLoginStatus} setShowForm={setShowForm} />
        <Game
          key={riddle.id}
          riddle={riddle}
          reset={() => {
            setRiddle(null);
            setProgress({});
          }}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </>
    );
  }
};
export default App;
