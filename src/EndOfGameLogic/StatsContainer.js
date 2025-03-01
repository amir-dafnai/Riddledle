import { getHMSFormat } from "../appUtils";
import { getGlobalStats, getUserStats } from "../localStorageUtils";

export const StatsContainer = ({ statsInfo }) => {
  return (
    <div className="stats-container">
      <div className="stat">
        <div className="stat-large">{statsInfo.leftVal}</div>
        <div className="stat-label">{statsInfo.leftLabel}</div>
      </div>
      <h3 className="stats-title">{statsInfo.title}</h3>
      <div className="stat">
        <div className="stat-large">{statsInfo.rightVal}</div>
        <div className="stat-label">{statsInfo.rightLabel}</div>
      </div>
    </div>
  );
};

const PersonalStats = () => {
  const defaultStats = { best_time: null, wins: 0, total: 0 };
  const personalStats = getUserStats() || defaultStats;
  const winPercentage = getFixedPercentage(
    personalStats.wins,
    personalStats.total
  );
  const statsInfo = {
    title: "המשחקים שלך",
    leftLabel: "הזמן הקצר ביותר שלך",
    leftVal: getHMSFormat(personalStats.best_time),
    rightLabel: `${personalStats.wins} / ${personalStats.total} הצלחות`,
    rightVal: `${winPercentage}%`,
  };

  return <StatsContainer statsInfo={statsInfo} />;
};

const GlobalStats = () => {
  const defaultStats = {
    total_wins: 0,
    total_plays: 0,
    user_name: null,
    best_time: null,
  };
  const globalStats = getGlobalStats() || defaultStats;
  const globalWinPercentage = getFixedPercentage(
    globalStats && globalStats.total_wins,
    globalStats && globalStats.total_plays
  );
  const statsInfo = {
    title: "היום",
    leftLabel: `הזמן הקצר ביותר 
              ${globalStats.user_name || ""}`,
    leftVal: getHMSFormat(globalStats.best_time),
    rightLabel: `${globalStats.total_wins} / ${globalStats.total_plays} הצליחו`,
    rightVal: `${globalWinPercentage}%`,
  };
  return <StatsContainer statsInfo={statsInfo} />;
};

export const Stats = () => {
  return (
    <>
      <GlobalStats />
      <PersonalStats />
    </>
  );
};

const getFixedPercentage = (numerator, denomeneator) => {
  if (!numerator || !denomeneator) return 0;
  const percentage = denomeneator === 0 ? 0 : (numerator / denomeneator) * 100;
  const fixedPercentage = percentage.toFixed(0);
  return fixedPercentage;
};
