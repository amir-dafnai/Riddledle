import { useEffect, useState } from "react";
import { arraysAreEqual, getUrl } from "./appUtils";
import { storeProgress, getProgress } from "./localStorageUtils";

import { Game } from "./Game";
import HowToPlayRules  from "./HowToPlay.js";
import  Navbar from "./Navbar.js"

import { VIEWS } from "./Consts";

import { CreditModal } from "./UserCreditModal";
import { WelcomeModal } from "./WelcomeModal";
import { ToastContainer } from "react-toastify";
import { UseLogin, UseUserDetails } from "./Common";
import { useParams } from "react-router-dom";

const riddlesAreEqual = (r1, r2) => {
  if (r1.id !== r2.id) return false;
  const r1Definitions = r1.group.map((riddle) => riddle.definition);
  const r2Definitions = r2.group.map((riddle) => riddle.definition);
  return arraysAreEqual(r1Definitions, r2Definitions);
};

const TodayPage = () => {
  const { riddleIds } = useParams(); 
  const [userDetails, setUserDetails] = UseUserDetails();
  const [viewStatus, setViewStatus] = useState(VIEWS.game);
  const [showCreditModal, setShowCreditModal] = useState(true);
  const [currentRiddle, setRiddle] = useState(getProgress().riddle);
  const [riddleGroup, setRiddleGroup] = useState(getProgress().riddleGroup);
  const isUsersRiddle =
    currentRiddle &&
    userDetails &&
    currentRiddle.credit_email === userDetails.email;
  const [timerWasClosed, setTimerWasClosed] = useState(false);

  const isMultiRiddle = riddleGroup && riddleGroup.group.length > 1;
  const login = UseLogin(setUserDetails);

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = getUrl();
      let url = `${baseUrl}get_riddle`
      if(riddleIds)
        url += `?riddle_ids=${riddleIds}`
      const response = await fetch(url);
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
  }, [riddleGroup, riddleIds]);

  if (!(userDetails && currentRiddle && riddleGroup))
    return <div>Loading...</div>;

  //userDetails.loggedIn = true;
  const passedWelcome =
    currentRiddle.startTime &&
    ![VIEWS.welcome, VIEWS.howToPLayWelcome].includes(viewStatus);
  return (
    <div>
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
        />
      )}
    </div>
  );
};
export default TodayPage;
