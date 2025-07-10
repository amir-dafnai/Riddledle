import { Routes, Route } from "react-router-dom";
import TodayPage from "./TodayPage";
import YesterdayPage from "./YesterdayPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    console.log(redirect)
    if (redirect) {
      sessionStorage.removeItem("redirect");
      navigate(redirect);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<TodayPage />} />
      <Route path="/yesterday" element={<YesterdayPage />} />
    </Routes>
  );
}

export default App;

