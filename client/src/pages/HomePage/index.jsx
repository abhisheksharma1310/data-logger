import React from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";

import "./styles.css"; // Assuming you have a CSS file for styling
import { setLandingPage } from "../../features/navDetail/navDetailSlice";
const HomePage = () => {
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    dispatch(setLandingPage(false));
  };

  return (
    <div>
      <navbar>
        <ul>
          <li>
            <Button type="primary" onClick={handleButtonClick}>
              Try App
            </Button>
          </li>
        </ul>
      </navbar>
    </div>
  );
};

export default HomePage;
