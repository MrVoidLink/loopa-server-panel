import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Outlet />
    </div>
  );
}

export default App;
