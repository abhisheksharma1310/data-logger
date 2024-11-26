import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../HomePage";

const LandingPage = ({ setLandingPage }) => {
  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={<HomePage setLandingPage={setLandingPage} />}
        />
        <Route
          path="/home"
          element={<HomePage setLandingPage={setLandingPage} />}
        />
      </Routes>
    </>
  );
};

export default LandingPage;
