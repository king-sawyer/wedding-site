import { useState } from "react";
// import { Route, Routes, Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const [displaySidebar, setDisplaySidebar] = useState(false);

  const toggleSidebar = () => {
    setDisplaySidebar(!displaySidebar);
  };

  return (
    <>
      {displaySidebar ? <Sidebar /> : ""}
      <div>
        <button onClick={toggleSidebar}>
          {displaySidebar ? "Hide Sidebar" : "Display Sidebar"}
        </button>
      </div>
    </>
  );
};

export default HomePage;
