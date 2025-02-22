import React from "react";
import "./Leaderboard.css";
import { getGlobalStats, getUserData } from "./localStorageUtils";
import { getHMSFormat } from "./appUtils";

const WIN = "win";

const getTopWinners = (stats, n = 5) => {
  const winners = stats
    ? stats.filter((e) => e.status === WIN && e.was_logged_in).slice(0, n)
    : [];
  return winners;
};

const getUserPosition = (globalStats , email) => {
  console.log(globalStats)
  for (const [position, player] of globalStats.entries()) {
    if (player.email === email) return [position, player];
  }
  return [null, null];
};

const getPLayersToShow = (email) => {
  const globalStats = getGlobalStats() || [];
  const winners = getTopWinners(globalStats);
  const [userPosition , user] = getUserPosition(globalStats, email);
  console.log(userPosition , user)
  if (userPosition && userPosition > 4 && user && user.status === WIN) {
    winners.push({...user , position : userPosition})
  }
  return winners
};

function Leaderboard() {
    const email = getUserData() && getUserData().email
    const players = getPLayersToShow(email);
    return (
        <div className="leaderboard">
        <table>
            <thead dir="rtl"></thead>
            <tbody>
            {players.map((player, index) => (
                <tr
                key={index}
                className={player.email === email ? "highlight" : ""}
                >
                <td>#{player.position || index + 1}</td>
                <td>{player.user_name} {index === 0 && player.email===email && '🏆'}</td>
                <td>{getHMSFormat(player.time)}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default Leaderboard;
