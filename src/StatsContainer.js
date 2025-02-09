export const StatsContainer = ({statsInfo})=>{
    return (
        <div className="stats-container">
          <div className="stat">
            <div className="stat-large">
              {statsInfo.leftVal}
            </div>
            <div className="stat-label">{statsInfo.leftLabel}</div>
          </div>
          <h3 className="stats-title">{statsInfo.title}</h3>
          <div className="stat">
            <div className="stat-large">{statsInfo.rightVal}</div>
            <div className="stat-label">
              {statsInfo.rightLabel}
            </div>
          </div>
        </div>
      );
}