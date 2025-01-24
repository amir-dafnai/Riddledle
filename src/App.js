import { useEffect, useState } from "react";
import { getUrl } from "./appUtils";
import { storeProgress, getProgress, getUserData } from "./localStorageUtils";

import { Game } from "./Game";
import Navbar from "./Navbar";
import { setGuestUser } from "./loginPage";
import { VIEWS } from "./Consts";
import { ToastContainer } from "react-toastify";

const riddlesAreEqual = (r1, r2) => {  
  return r1.id === r2.id && r1.definition === r2.definition;
};

const useRiddle = () => {
  const [riddle, setRiddle] = useState(getProgress().riddle);
  useEffect(() => {
    const url = getUrl();
    const fetchData = async () => {
      const response = await fetch(`${url}get_riddle?&new=${riddle === null}`);
      const data = await response.json();
      if (riddle && riddlesAreEqual(riddle, data.riddle)) return;
      storeProgress({});
      setRiddle(data.riddle);
    };
    fetchData();
  }, [riddle]);

  return [riddle, setRiddle];
};

const App = () => {
  const [riddle, setRiddle] = useRiddle();
  const [userDetials, setUserDetails] = useState(null);
  const [viewStatus, setViewStatus] = useState(VIEWS.game);

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setUserDetails(storedUser);
    } else {
      setGuestUser(setUserDetails);
    }
  }, []);

  if (userDetials && riddle) {
    return (
      <>
        <ToastContainer theme="dark" />
        <Navbar
          isLoggedIn={userDetials.loggedIn}
          setUserDetails={setUserDetails}
          setViewStatus={setViewStatus}
          viewStatus={viewStatus}
        />
        <Game
          key={`${riddle.id}-${userDetials.email}`}
          riddle={riddle}
          reset={() => {
            setRiddle(undefined);
            storeProgress({});
          }}
          viewStatus={viewStatus}
          setViewStatus={setViewStatus}
        />
      </>
    );
  }
};
export default App;
