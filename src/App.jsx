import "./App.css";

import Connections from "./pages/Connections";

import { Routes, Route } from "react-router-dom";
import MiniCrossword from "./pages/MiniCrossword";
import Wordle from "./pages/Wordle";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Leaderboard from "./pages/Leaderboard";
import Welcomepage from "./pages/Welcomepage";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./pages/Profile";
import PhotoPage from "./pages/PhotoPage";
import Timeline from "./pages/Timeline";
import Voicemail from "./pages/Voicemail";

function App() {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const navigate = useNavigate();

  const handleSetUserData = (returnedUserData) => {
    setUserData(returnedUserData);
    localStorage.setItem("userData", JSON.stringify(returnedUserData));
  };

  const clearStorage = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    navigate("/");
  };

  return (
    <>
      {userData ? (
        <Routes>
          <Route path="/" element={<Sidebar />}>
            <Route
              path=""
              element={
                <Welcomepage logout={clearStorage} userData={userData} />
              }
            />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="voice" element={<Voicemail />} />
            <Route path="messages" element={<Messages userData={userData} />} />
            <Route
              path="connections"
              element={<Connections userData={userData} />}
            />
            <Route path="mini" element={<MiniCrossword />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="wordle" element={<Wordle userData={userData} />} />
            <Route path="photos" element={<PhotoPage />} />
            <Route path="/profile" element={<Profile userData={userData} />} />
          </Route>
        </Routes>
      ) : (
        <Login setUserData={handleSetUserData} />
      )}
    </>
  );
}

export default App;
