import React from "react";
import "./StatisticsModal.css";
import { getHMSFormat, getUrl } from "./appUtils";
import {
  getUserData,
  storeLeaderBoardStats,
  storeUserStats,
} from "./localStorageUtils";
import { VIEWS } from "./Consts";

export const insertStats = (body) => {
  const url = getUrl();
  const response = fetch(`${url}insert_stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
};

export const fetchStats = async (email) => {
  const response = await fetch(`${getUrl()}get_stats?&email=${email}`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.stats;
};

export const fetchGlobalStats = async (riddleGroup) => {
  console.log("fetching");
  const groupID = riddleGroup.group.length > 1 ? riddleGroup.id : -1;
  const riddleID = groupID !== -1 ? -1 : riddleGroup.id; //the group id is equal to the single riddle id
  const response = await fetch(
    `${getUrl()}get_global_stats?&riddle_id=${riddleID}&group_id=${groupID}`
  );
  const data = await response.json();
  console.log("got ", data.global_stats);
  return data;
};

const fetchAndStoreGlobalStats = async (riddleGroup, setStats) => {
  const data = await fetchGlobalStats(riddleGroup);

  const newStats = {
    globalStats: data.global_stats,
    allTimeWinners: data.all_time_winners,
    weeklyWinners: data.weekly_winners,
    personalScores: data.personal_scores,
  };
  setStats((prevStats) => ({ ...prevStats, leaderBoardStats: newStats }));
  storeLeaderBoardStats(newStats);
};

const fetcAndStoreStats = async (email, setStats) => {
  const userStats = await fetchStats(email);
  storeUserStats(userStats);
  setStats((prev) => ({ ...prev, userStats: userStats }));
};

export const fetchAndStoreAllStats = (riddleGroup, setStats) => {
  const userData = getUserData();
  const email = userData && userData.email;
  if (email && String(email).includes("@")) {
    fetchAndStoreGlobalStats(riddleGroup, setStats);
    fetcAndStoreStats(email, setStats);
  }
};

export const StatisticsModal = ({
  isLoggedIn,
  login,
  setViewStatus,
  userStats,
}) => {
  let stats = isLoggedIn ? userStats : null;
  stats =
    stats === null
      ? { total: 0, wins: 0, curr_streak: 0, longest_streak: 0 }
      : stats;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="title">הנתונים שלך</h2>
        {!isLoggedIn && (
          <p className="title">
            {" יש להתחבר למערכת כדי לצפות בסטטיסטיקה  "}
            <span className="login-link" onClick={login}>
              להתחברות
            </span>
          </p>
        )}
        <div className={`stats-grid ${!isLoggedIn ? "dimmed" : ""}`}>
          <div>
            <h3>{stats.total}</h3>
            <p>כמות משחקים</p>
          </div>

          <div>
            <h3>
              {stats.total === 0
                ? 0
                : Math.round((stats.wins / stats.total) * 100)}
              %
            </h3>
            <p>אחוז הצלחות</p>
          </div>
          <div>
            <h3>{getHMSFormat(stats.best_time)}</h3>
            <p>הזמן הטוב ביותר</p>
          </div>
          <div>
            <h3>{stats.longest_streak}</h3>
            <p>רצף הצלחות מקסימלי</p>
          </div>
        </div>
        <button
          className="close-button"
          onClick={() => setViewStatus(VIEWS.game)}
        >
          x
        </button>
      </div>
    </div>
  );
};
