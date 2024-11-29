import React from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import image from "../../assets/images/hero-image.jpg";

import "./styles.css"; // Assuming you have a CSS file for styling
import { setLandingPage } from "../../features/navDetail/navDetailSlice";
import features from "./features";
const HomePage = () => {
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    dispatch(setLandingPage(false));
  };

  return (
    <div className="landing-page">
      <header className="landing-page-header">
        <nav>
          <Button type="primary" color="#5a4cdb" onClick={handleButtonClick}>
            Try For Free
          </Button>
        </nav>
      </header>
      <main>
        <div className="hero-section">
          <div className="hero-title">
            <h1>Quick and easy data logger</h1>
            <p>
              Everything you need to log and visualize data, No coding required.
            </p>
            <Button type="primary" color="#5a4cdb" onClick={handleButtonClick}>
              Try For Free
            </Button>
          </div>
        </div>

        <div className="main-title1">
          <h2>Smart features that help you</h2>
        </div>

        <div className="features-section">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className={
                  index % 2 === 0 ? "two-column" : "two-column row-reverse"
                }
              >
                <div className="column-1">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <div className="column-2">
                  <img src={feature.imageUrl} alt={`image-${feature.title}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="features-section2">
          <h3>Transform your data into charts</h3>
          <div className="fe-sec2-image">
            <img
              src="https://i.ibb.co/jwzn2hY/bar-chart.jpg"
              alt="bar-chart"
              border="0"
              title="bar chart"
            />
            <img
              src="https://i.ibb.co/L0T2cSt/pie-chart.jpg"
              alt="pie-chart"
              border="0"
              title="pie chart"
            />
            <img
              src="https://i.ibb.co/Q8Mt7D7/line-chart.jpg"
              alt="line-chart"
              border="0"
              title="line chart"
            />
          </div>
        </div>

        <div className="action-section">
          <div className="action-button">
            <h3>Start using data logger app</h3>
            <Button onClick={handleButtonClick}>Try For Free</Button>
          </div>
          <div>
            <img
              src="https://i.ibb.co/wB6fxrN/data-logger.gif"
              alt="action"
              width="500"
            />
          </div>
        </div>
      </main>

      <footer>
        <p>Data Logger project is designed and developed by &nbsp; </p>

        <a href="https://abhisheksharma1310.github.io" target="_blank">
          Abhishek Sharma
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
