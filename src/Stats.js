import React from "react";
import "./StatisticsModal.css";
import { getHMSFormat, getUrl } from "./appUtils";
import {
  getUserStats,
  storeAllTimeWinners,
  storeGlobalStats,
  storePersonalScores,
  storeWeeklyWinners,
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
  const data = await response.json();
  return data.stats;
};

export const fetchGlobalStats = async (riddleId) => {
  const response = await fetch(
    `${getUrl()}get_global_stats?&riddle_id=${riddleId}`
  );
  const data = await response.json();
  return data;
};

export const fetchAndStoreGlobalStats = async (riddle) => {
  const data = await fetchGlobalStats(riddle.id);
  storeGlobalStats(data.global_stats);
  if (data.all_time_winners) storeAllTimeWinners(data.all_time_winners);
  if (data.weekly_winners) storeWeeklyWinners(data.weekly_winners);
  if (data.personal_scores) storePersonalScores(data.personal_scores)
};

export const StatisticsModal = ({ isLoggedIn, login, setViewStatus }) => {
  let stats = isLoggedIn ? getUserStats() : null;
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
