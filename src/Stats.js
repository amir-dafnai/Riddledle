import React from "react";
import "./StatisticsModal.css";
import { getUrl } from "./appUtils";
import { getUserStats } from "./localStorageUtils";
import { VIEWS } from "./Consts";

export const insertStats = (body)=>{ 
  const url = getUrl();
  const  response = fetch(`${url}insert_stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(body),
  });
  return response
}

export const fetchStats = async (email) => {
  const response = await fetch(`${getUrl()}get_stats?&email=${email}`);
  const data = await response.json();
  return data.stats;
};

export const StatisticsModal = ({ setViewStatus }) => {
  let stats = getUserStats();
  stats =
    stats === null
      ? { total: 0, wins: 0, curr_streak: 0, longest_streak: 0 }
      : stats;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="title">סטטיסטיקה</h2>
        <div className="stats-grid">
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
            <p>אחוז נצחונות</p>
          </div>
          <div>
            <h3>{stats.curr_streak}</h3>
            <p>רצף נוכחי</p>
          </div>
          <div>
            <h3>{stats.longest_streak}</h3>
            <p>רצף מקסימלי</p>
          </div>
        </div>
        <button
          className="close-button"
          onClick={() => setViewStatus(VIEWS.game)}
        >
          סגור
        </button>
      </div>
    </div>
  );
};
