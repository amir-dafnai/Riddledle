import React, { useState } from "react";
import "./Leaderboard.css";
import {
  getAllTimeWinners,
  getGlobalStats,
  getUserData,
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
    console.log("fetching stats");
    fetchAndStoreGlobalStats(riddle);
  }
  return getAllTimeWinners().slice(0, n);
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

function Leaderboard({ riddle ,login}) {
  const [isAllTime, setIsAllTime] = useState(false);
  const userData = getUserData()
  const email = userData && userData.loggedIn ? userData.email : '';
  const todayPlayers = getTodaysPLayers(email);
  const allTimePlayers = getOrFetchAllTimeWinners(riddle);
  const players = !isAllTime ? todayPlayers : allTimePlayers;
  return (
    <div>
    <div className="leaderboard">
      <div className="leaderboard-toggle">
        <button
          className={!isAllTime ? "active" : ""}
          onClick={() => setIsAllTime(false)}
        >
          היום
        </button>
        <button
          className={isAllTime ? "active" : ""}
          onClick={() => setIsAllTime(true)}
        >
          אלופים
        </button>
      </div>

      <table>
        <thead dir="rtl"></thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={index}
              className={player.email === email  ? "highlight" : ""}
            >
              <td>#{player.position || index + 1}</td>
              <td>
                {player.user_name}{" "}
                {index === 0  && player.email === email && "🏆"}
              </td>
              <td>{!isAllTime ? getHMSFormat(player.time) : player.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <GuestUserMessage login={login}/>
    </div>
  );
}

export default Leaderboard;
