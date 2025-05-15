import "./App.css";

import Connections from "./pages/Connections";

import { Routes, Route } from "react-router-dom";
import MiniCrossword from "./pages/MiniCrossword";
import Wordle from "./pages/Wordle";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
//import { useState } from "react";

function App() {
  //const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Routes>
      <Route path="/" element={<Sidebar />}>
        <Route index element={<Login />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/mini" element={<MiniCrossword />} />
        <Route path="/wordle" element={<Wordle />} />
      </Route>
    </Routes>
  );
}

export default App;
