import { Routes, Route } from "react-router-dom";
import TodayPage from "./TodayPage";
import YesterdayPage from "./YesterdayPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodayPage />} />
      <Route path="/yesterday" element={<YesterdayPage />} />
    </Routes>
  );
}

export default App;
