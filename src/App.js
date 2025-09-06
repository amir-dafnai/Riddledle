import { Routes, Route } from "react-router-dom";
import TodayPage from "./TodayPage";
import YesterdayPage from "./YesterdayPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const ROOT = "/"
export const YESTERDAY = '/yesterday'
export const SPECIFICRIDDLES = ':riddleIds'

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
      <Route path={ROOT} element={<TodayPage />} />
      <Route path={SPECIFICRIDDLES} element={<TodayPage />} />
      <Route path={YESTERDAY} element={<YesterdayPage />} />
    </Routes>
  );
}

export default App;

