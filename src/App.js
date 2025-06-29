import { useEffect, useState } from "react";
import { arraysAreEqual, getUrl } from "./appUtils";
import { storeProgress, getProgress, getUserData } from "./localStorageUtils";

import { Game } from "./Game";
import Navbar, { HowToPlayRules } from "./Navbar";
import { onLoginSuccess, setGuestUser } from "./loginPage";
import { VIEWS } from "./Consts";
import { useGoogleLogin } from "@react-oauth/google";
import { CreditModal } from "./UserCreditModal";
import { WelcomeModal } from "./WelcomeModal";
import { ToastContainer } from "react-toastify";

const riddlesAreEqual = (r1, r2) => {
  if (r1.id !== r2.id) return false;
  const r1Definitions = r1.group.map((riddle) => riddle.definition);
  const r2Definitions = r2.group.map((riddle) => riddle.definition);
  return arraysAreEqual(r1Definitions, r2Definitions);
};

const App = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [viewStatus, setViewStatus] = useState(VIEWS.game);
  const [showCreditModal, setShowCreditModal] = useState(true);
  const [currentRiddle, setRiddle] = useState(getProgress().riddle);
  const [riddleGroup, setRiddleGroup] = useState(getProgress().riddleGroup);
  const isUsersRiddle =
    currentRiddle &&
    userDetails &&
    currentRiddle.credit_email === userDetails.email;
  const [timerWasClosed, setTimerWasClosed] = useState(false);
  const [score, setScore] = useState(null);

  const isMultiRiddle = riddleGroup && riddleGroup.group.length > 1;

  useEffect(() => {
    const fetchData = async () => {
      const url = getUrl();
      const response = await fetch(`${url}get_riddle`);
      if (!response.ok) return;
      const data = await response.json();
      if (riddleGroup && riddlesAreEqual(riddleGroup, data.riddle_group))
        return;
      data.riddle_group.group[0].endTime = null;
      storeProgress({});
      setRiddle(data.riddle_group.group[0]);
      setViewStatus(VIEWS.welcome); // show modal on new riddle
      setRiddleGroup(data.riddle_group);
    };
    fetchData();
  }, [riddleGroup]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(setUserDetails, tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setUserDetails(storedUser);
    } else {
      setGuestUser(setUserDetails);
    }
  }, []);


  if (userDetails && currentRiddle && riddleGroup) {
    const passedWelcome =
      currentRiddle.startTime &&
      ![VIEWS.welcome, VIEWS.howToPLayWelcome].includes(viewStatus);
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        {passedWelcome && (
          <Navbar
            login={login}
            isLoggedIn={userDetails.loggedIn}
            setUserDetails={setUserDetails}
            setViewStatus={setViewStatus}
            viewStatus={viewStatus}
            isMultiRiddle={isMultiRiddle}
          />
        )}
        {(!isUsersRiddle || isMultiRiddle) && viewStatus === VIEWS.welcome && (
          <WelcomeModal
            onClose={() => {
              setViewStatus(VIEWS.game);
              currentRiddle.startTime = Date.now();
            }}
            login={login}
            onHowToPLay={() => setViewStatus(VIEWS.howToPLayWelcome)}
            isLoggedIn={userDetails.loggedIn}
            isMultiRiddle={isMultiRiddle}
          />
        )}
        {viewStatus === VIEWS.howToPLayWelcome && (
          <HowToPlayRules
            closeModal={() => setViewStatus(VIEWS.welcome)}
            isLoggedIn={userDetails.loggedIn}
            login={login}
          />
        )}
        {!isMultiRiddle && showCreditModal && isUsersRiddle && (
          <CreditModal
            onClose={() => {
              currentRiddle.startTime = Date.now();
              setShowCreditModal(false);
              setViewStatus(VIEWS.game);
            }}
          />
        )}
        {passedWelcome && (
          <>
            <Game
              key={`${currentRiddle.id}-${userDetails.email}`}
              riddle={currentRiddle}
              viewStatus={viewStatus}
              setViewStatus={setViewStatus}
              userDetails={userDetails}
              login={login}
              riddleGroup={riddleGroup}
              setRiddle={setRiddle}
              timerWasClosed={timerWasClosed}
              setTimerWasClosed={setTimerWasClosed}
              score={score}
              setScore={setScore}
            />
          </>
        )}
      </>
    );
  }
};
export default App;
