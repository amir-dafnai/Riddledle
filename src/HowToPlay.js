import "./howToPlay.css";

const HowToPlayRules = ({ closeModal, isLoggedIn, login }) => {
  const goToLogin = () => {
    closeModal();
    login();
  };
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content how-to-play-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-button" onClick={closeModal}>
          ×
        </button>
        <h2>איך משחקים</h2>
        <p>פתרו את חידת ההגיון ב-4 ניסיונות.</p>
        <ul>
          <li>צבע האותיות ישתנה כדי להראות עד כמה הניחוש קרוב לפתרון.</li>
        </ul>
        <h3>דוגמאות</h3>
        <div className="examples">
          <div className="example-row">
            <div className="example-tiles">
              <span className="tile green">נ</span>
              <span className="tile">ע</span>
              <span className="tile">מ</span>
              <span className="tile">ה</span>
            </div>
            <p className="example-description">
              נ' נמצאת בפתרון ובמיקום הנכון.
            </p>
          </div>
          <div className="example-row">
            <div className="example-tiles">
              <span className="tile">א</span>
              <span className="tile">י</span>
              <span className="tile yellow">ת</span>
              <span className="tile">י</span>
            </div>
            <p className="example-description">
              ת' נמצאת בפתרון אך לא במיקום הנכון.
            </p>
          </div>
          <div className="example-row">
            <div className="example-tiles">
              <span className="tile grey">א</span>
              <span className="tile">מ</span>
              <span className="tile">י</span>
              <span className="tile">ר</span>
            </div>
            <p className="example-description">א' לא נמצאת כלל בפתרון.</p>
          </div>
        </div>
        <p>חידה חדשה תתפרסם מדי יום בחצות!</p>
        {!isLoggedIn ? (
          <p className="login-redirect" onClick={goToLogin}>
            <u> התחבר כדי להנות מסטטיסטיקות ויכולת להציע חידות משלך!</u>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default HowToPlayRules;