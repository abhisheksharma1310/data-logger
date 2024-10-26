import React from "react";
import "./styles.css"; // Assuming you have a CSS file for styling

const Home = () => {
  return (
    <div className="container">
      <div className="content">
        <p className="intro">
          Welcome to our versatile web application, designed to seamlessly
          connect and display data from various protocols including Serial Port,
          HTTP, MQTT, WebSocket and Socket.io. Whether you’re a developer,
          engineer, or hobbyist, our app provides a user-friendly interface to
          access and visualize your data in real-time.
        </p>
        <h2 className="features-title">Key Features:</h2>
        <ul className="features-list">
          <li className="feature-item">
            <strong>Multi-Protocol Support:</strong> Easily connect to Serial
            Port, HTTP, MQTT, WebSocket and Socket.io.
          </li>
          <li className="feature-item">
            <strong>Real-Time Data Display:</strong> View your data in a
            structured tabular format.
          </li>
          <li className="feature-item">
            <strong>User-Friendly Interface:</strong> Enter protocol-specific
            details effortlessly.
          </li>
          <li className="feature-item">
            <strong>Cross-Platform Compatibility:</strong> Serial Port Works
            seamlessly on any browsers.
          </li>
          <li className="feature-item">
            <strong>PWA Support:</strong> Install web app as progressive web app
            on laptop or mobile and work without internet for local development.
          </li>
        </ul>
        <p className="conclusion">
          Explore the power of real-time data access and visualization with our
          app. Get started by entering the required details for your preferred
          protocol and see your data come to life!
        </p>
        <p className="conclusion">
          For any help see github repository at:
          <a
            href="https://github.com/abhisheksharma1310/data-visualizer.git"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/abhisheksharma1310/data-visualizer.git
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
