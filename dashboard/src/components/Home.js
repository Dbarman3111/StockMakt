import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import AuthGuard from "./AuthGuard";

const Home = () => {
  return (
    <AuthGuard>
      <TopBar />
      <Dashboard />
    </AuthGuard>
  );
};

export default Home;
