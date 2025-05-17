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

function App() {
  const [name, setName] = useState(localStorage.getItem("name"));

  const handleSetName = (userName) => {
    console.log(userName);
    setName(userName);
    localStorage.setItem("name", userName);
  };

  const clearStorage = () => {
    setName("");
    localStorage.removeItem("name");
  };

  return (
    <>
      {name ? (
        <Routes>
          <Route path="/" element={<Sidebar />}>
            <Route
              path=""
              element={<Welcomepage logout={clearStorage} name={name} />}
            />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="connections" element={<Connections />} />
            <Route path="mini" element={<MiniCrossword />} />
            <Route path="wordle" element={<Wordle />} />
          </Route>
        </Routes>
      ) : (
        <Login setName={handleSetName} />
      )}
    </>
  );
}

export default App;
