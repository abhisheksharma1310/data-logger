import React from "react";
import "./styles.css"; // Assuming you have a CSS file for styling

const Home = () => {
  return (
    <div className="container">
      <div className="content">
        <p className="intro">
          Welcome to the Data Logger and Chart Visualization application! This
          tool helps you seamlessly log and visualize sensor data, providing a
          user-friendly web interface for dynamic chart creation and
          customization.
        </p>
        <h2 className="features-title">Key Features:</h2>
        <ul className="features-list">
          <li className="feature-item">
            <strong>Log Management:</strong> Automatically logs and clears the
            serial data according to configuration file.
          </li>
          <li className="feature-item">
            <strong>Real-Time Data Display:</strong> View your data in a
            structured tabular format and as chart.
          </li>
          <li className="feature-item">
            <strong>Customizable Charts:</strong> Select data items to display,
            choose chart types (Line, Bar, Pie), and customize chart appearance.
          </li>
          <li className="feature-item">
            <strong>Cross-Platform Compatibility:</strong> App Works seamlessly
            on any os windows or linux.
          </li>
          <li className="feature-item">
            <strong>Downloadable Charts:</strong> Save your charts as images.
          </li>
          <li className="feature-item">
            <strong>Option to choose logs storage:</strong> Logs can be stored
            in mongoDB database or in file.
          </li>
        </ul>
        <p className="conclusion">
          For any help see github repository at:
          <a
            href="https://github.com/abhisheksharma1310/data-logger.git"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/abhisheksharma1310/data-logger.git
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
