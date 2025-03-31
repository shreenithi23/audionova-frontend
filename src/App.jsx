import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from "./components/Mainpage";
import Login from "./components/Login";
import Callback from "./components/Callback";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
