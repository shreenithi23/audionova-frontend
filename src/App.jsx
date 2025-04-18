import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from "./components/Mainpage";
import Login from "./components/Login";
import Callback from "./components/Callback";
import Dashboard from "./components/Dashboard";
import RecommendArtists from "./components/RecommendArtists";
import SongRecommendation from "./components/SongRecommendation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recommend-artists" element={<RecommendArtists />} />
        <Route path="/recommend-song" element={<SongRecommendationWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrap SongRecommendation to get userId from localStorage
const SongRecommendationWrapper = () => {
  const storedUserId = localStorage.getItem("userId");
  if (!storedUserId) {
    window.location.href = "/login";
    return null;
  }

  return <SongRecommendation userId={storedUserId} />;
};

export default App;
