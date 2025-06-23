import React, { useEffect, useRef, useState } from "react";
import "./Leaderboard.css";
import { getUserData } from "./localStorageUtils";
import { getHMSFormat } from "./appUtils";

const WIN = "win";

const getLoggedInWinners = (players) => {
  if (!players) return [];
  return players.filter((e) => e.status === WIN && e.was_logged_in);
};

const getUserPosition = (winners, email) => {
  for (const [position, player] of winners.entries()) {
    if (player.email === email) return [position, player];
  }
  return [null, null];
};

const getTodaysPLayers = (email, globalStats, n = 5) => {
  const allWinners = getLoggedInWinners(globalStats);
  const winners = allWinners.slice(0, n);
  const [userPosition, user] = getUserPosition(allWinners, email);
  if (userPosition && userPosition > 4 && user && user.status === WIN) {
    winners.push({ ...user, position: userPosition + 1 });
  }
  return winners;
};

const GuestUserMessage = ({ login }) => {
  return (
    <div className="guest-user-message">
      <h3 dir="rtl"> רוצה גם להופיע כאן?</h3>
      <span className="login-link" onClick={login}>
        להתחברות
      </span>
    </div>
  );
};

const DailyLeaders = ({ players, email }) => {
  if (players.length === 0) {
    return (
      <tr>
        <td dir="rtl">אין עדיין מנצחים היום...</td>
      </tr>
    );
  }

  return players.map((player, index) => (
    <tr key={index} className={player.email === email ? "highlight" : ""}>
      <td>#{player.position || index + 1}</td>
      <td>
        {player.user_name} {index === 0 && player.email === email && "🏆"}
      </td>
      <td>{getHMSFormat(player.time)}</td>
    </tr>
  ));
};

const AllTimeLeaders = ({ players, email, n = 5 }) => {
  const nPlayers = players.slice(0, n);
  const [userPosition, user] = getUserPosition(players, email);

  if (userPosition && userPosition >= n && user) {
    nPlayers.push({ ...user, position: userPosition + 1 });
  }
  return nPlayers.map((player, index) => (
    <tr key={index} className={player.email === email ? "highlight" : ""}>
      <td>#{player.position || index + 1}</td>
      <td>
        {player.user_name} {index === 0 && player.email === email && "🏆"}
      </td>
      <td>{player.count}</td>
    </tr>
  ));
};

const WeeklyWinners = ({ players, email }) => {
  return players.map((player, index) => (
    <tr key={index} className={player.email === email ? "highlight" : ""}>
      <td>{player.date}</td>
      <td>
        {player.user_name || '😔'} {index === 0 && player.email === email && "🏆"}
      </td>
      <td>{getHMSFormat(player.time)}</td>
    </tr>
  ));
};

const ScoreLeaders = ({ players, email }) => {
  const userRowRef = useRef(null);

  useEffect(() => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <>
      {players.map((player, index) => (
        <tr
          key={player.email}
          ref={player.email === email ? userRowRef : null}
          className={player.email === email ? "highlight" : ""}
        >
          <td>{index + 1}</td>
          <td dir="rtl">{player.user_name}</td>
          <td>{player.score}</td>
        </tr>
      ))}
    </>
  );
};

function Leaderboard({ login, leaderBoardStats }) {
  const [mode, setMode] = useState("today");
  const userData = getUserData();
  const email = userData && userData.loggedIn ? userData.email : "";
  const todayWinners = getTodaysPLayers(email, leaderBoardStats.globalStats);

  return (
    <div>
      <div className="leaderboard">
        <div className="leaderboard-toggle">
          <button
            className={mode === "today" ? "active" : ""}
            onClick={() => setMode("today")}
          >
            היום
          </button>
          <button
            className={mode === "week" ? "active" : ""}
            onClick={() => setMode("week")}
          >
            מנצחי השבוע
          </button>
          <button
            className={mode === "alltime" ? "active" : ""}
            onClick={() => setMode("alltime")}
          >
            כל הזמנים
          </button>
          <button
            className={mode === "score" ? "active" : ""}
            onClick={() => setMode("score")}
          >
            דירוג מצטבר
          </button>
        </div>

        <table>
          <thead dir="rtl"></thead>
          <tbody>
            {mode === "today" ? (
              <DailyLeaders players={todayWinners} email={email} />
            ) : mode === "week" ? (
              <WeeklyWinners
                players={leaderBoardStats.weeklyWinners}
                email={email}
              />
            ) : mode === "alltime" ? (
              <AllTimeLeaders
                players={leaderBoardStats.allTimeWinners}
                email={email}
              />
            ) : (
              <ScoreLeaders
                players={leaderBoardStats.personalScores}
                email={email}
              />
            )}
          </tbody>
        </table>
      </div>
      {!userData.loggedIn && <GuestUserMessage login={login} />}
    </div>
  );
}

export default Leaderboard;
