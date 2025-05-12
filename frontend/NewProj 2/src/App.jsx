import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Post from "./components/Post";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import StartPage from "./pages/StartPage";
import NavBar from "./components/NavBar";
import ClubsCardsPage from "./pages/ClubsCardsPage";
import ClubsPage from "./pages/ClubsPage";
import Events from "./pages/Events";
import LeaderBoard from "./pages/LeaderBoard";
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
      <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center">
        <Routes>
          <Route style path="/" element={<StartPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/navbar" element={<NavBar />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/clubs" element={<ClubsCardsPage />} />
          <Route path="/clubpage" element={<ClubsPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
