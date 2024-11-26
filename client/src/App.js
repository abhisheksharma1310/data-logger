import React from "react";
import { HashRouter as Router } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import { useSelector } from "react-redux";

export default function App() {
  const { landingPage } = useSelector((state) => state.navDetail);

  return (
    <div className="App">
      <Router>
        {landingPage && <LandingPage />}
        {!landingPage && <MainPage />}
      </Router>
    </div>
  );
}
