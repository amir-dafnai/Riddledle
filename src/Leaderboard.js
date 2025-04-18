import React, { useState } from "react";
import "./Leaderboard.css";
import {
  getAllTimeWinners,
  getGlobalStats,
  getUserData,
  getWeeklyWinners,
} from "./localStorageUtils";
import { getHMSFormat } from "./appUtils";
import { fetchAndStoreGlobalStats } from "./Stats";

const WIN = "win";

const getLoggedInWinners = (players) => {
  if (!players) return [];
  return players.filter((e) => e.status === WIN && e.was_logged_in);
};

const getTopWinners = (stats, n = 5) => {
  const winners = getLoggedInWinners(stats).slice(0, n);
  return winners;
};

const getUserPosition = (globalStats, email) => {
  const winners = getLoggedInWinners(globalStats);
  for (const [position, player] of winners.entries()) {
    if (player.email === email) return [position, player];
  }
  return [null, null];
};

const getTodaysPLayers = (email) => {
  const globalStats =
    getGlobalStats() && getGlobalStats()[0] ? getGlobalStats() : [];
  const winners = getTopWinners(globalStats);
  const [userPosition, user] = getUserPosition(globalStats, email);
  if (userPosition && userPosition > 4 && user && user.status === WIN) {
    winners.push({ ...user, position: userPosition + 1 });
  }
  return winners;
};

const getOrFetchAllTimeWinners = (riddle, n = 5) => {
  const winners = getAllTimeWinners();
  if (!winners) {
    fetchAndStoreGlobalStats(riddle);
  }
  const weeklyWinners = getWeeklyWinners() || [];
  const allTimeWinners = (getAllTimeWinners() || []).slice(0, n);
  return [weeklyWinners, allTimeWinners];
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

const AllTimeLeaders = ({ players, email }) => {
  return players.map((player, index) => (
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
      <td>#{player.position || index + 1}</td>
      <td>
        {player.user_name} {index === 0 && player.email === email && "🏆"}
      </td>
      <td>{player.date}</td>
    </tr>
  ));
};

function Leaderboard({ riddle, login }) {
  const [mode, setMode] = useState("today");
  const userData = getUserData();
  const email = userData && userData.loggedIn ? userData.email : "";
  const todayWinners = getTodaysPLayers(email);
  const [weeklyWinners, allTimePlayers] = getOrFetchAllTimeWinners(riddle);

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
        </div>

        <table>
          <thead dir="rtl"></thead>
          <tbody>
            {mode === "today" ? (
              <DailyLeaders players={todayWinners} email={email} />
            ) : mode === "week" ? (
              <WeeklyWinners players={weeklyWinners} email={email} />
            ) : (
              <AllTimeLeaders players={allTimePlayers} email={email} />
            )}
          </tbody>
        </table>
      </div>
      {!userData.loggedIn && <GuestUserMessage login={login} />}
    </div>
  );
}

export default Leaderboard;
