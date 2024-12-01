# Data Logger and Chart Visualization

<div  width="100%">  <img  src="https://i.ibb.co/dGRxd7N/data-logger-mockup-removebg-preview.png"  alt="Data Logger Mockup"/></div>

<div>
    <a  href="https://abhisheksharma1310.github.io/data-logger"  target="\_blank">Click here for live demo</a> 
</div>

<hr>

> This web application provides an all-encompassing solution for automated data logging and real-time visualization, featuring flexible storage options, historical data access, automated log deletion, customizable chart visualizations, and versatile data export capabilities, all managed through an intuitive browser-based configuration interface and compatible with a wide range of devices and operating systems.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Logging Data](#logging-data)
- [Viewing Logs](#viewing-logs)
- [Customizing Your Charts](#customizing-your-charts)

## Overview

- **Log Management:** Automatically logs and clears the serial data according to the configuration file.
- **Customizable Charts:** Select data items to display, choose chart types (Line, Bar, Pie), and customize chart appearance.
- **Real-Time Data:** Charts and Table update in real-time as you make changes.
- **Downloadable Charts:** Save your charts as images.
- **Log Storage Options:** Logs can be stored in MongoDB database or in file.

## Features

- **Automated Data Logging:** Effortlessly log data with a one-time configuration. Once set, your data will be automatically captured as per your preferences. <img  src="https://i.ibb.co/mq849rj/An-illustration-of-a-computer-screen-showing-data-being-logged.jpg"  alt="Automated Data Logging"  />

- **Flexible Data Storage:** Choose your preferred data storage method: local system files, a locally hosted MongoDB, or the cloud with MongoDB Atlas. <img  src="https://i.ibb.co/jDJFFN5/An-illustration-of-a-user-selecting-storage-options-with-icons.jpg"  alt="Flexible Data Storage"  />

- **See Previous Logs:** Access past data logs with ease. Select your preferred database and specify a date range to view the historical data you need. <img  src="https://i.ibb.co/qphmFJV/log-history.png"  alt="See Previous Logs"  />

- **Automated Log Deletion:** Keep your data management efficient with auto-delete functionality. Configure the system to automatically delete logs after a set number of days, as specified in your configuration file. <img  src="https://i.ibb.co/YT5PNfX/auto-delete.png"  alt="Automated Log Deletion"  />

- **Real-Time Data Visualization:** Experience real-time data visualization with zero latency, thanks to Socket.io, allowing you to see your data instantly in the browser. <img  src="https://i.ibb.co/sgttpzy/real-Time-Data.png"  alt="Real-Time Data Visualization"  />

- **Tabular Data Presentation:** View your data in a clear tabular format with options to include or exclude timestamps. <img  src="https://i.ibb.co/ZzBZ0DK/show-tabular-data.png"  alt="Tabular Data Presentation"  />

- **Comprehensive Chart Visualizations:** Gain insights through various chart types, including line, bar, and pie charts. Customize and combine data as needed. <img  src="https://i.ibb.co/DMW1G42/chart-visualization.png"  alt="Comprehensive Chart Visualizations"  />

- **Customizable Charts:** Personalize your charts by editing labels, colors, and types to suit your specific needs. <img  src="https://i.ibb.co/vZ61sbZ/customize-chart.png"  alt="Customizable Charts"  />

- **Versatile Data Export:** Download your data in multiple formats: JSON, TXT, DOC, XLSX, PDF, and CSV, ensuring compatibility with various applications. <img  src="https://i.ibb.co/XWLsDQn/Download-data.png"  alt="Versatile Data Export"  />

- **One-Click Chart Downloads:** Easily download charts with a single click for seamless sharing and reporting. <img  src="https://i.ibb.co/7XWHrsz/download-chart.png"  alt="One-Click Chart Downloads"  />

- **Data Transmission to Devices:** Send commands or data to your serial devices for enhanced control and monitoring. <img  src="https://i.ibb.co/kJZ5kYX/send-data.png"  alt="Data Transmission to Devices"  />

- **Browser-Based Configuration:** Set and manage your configuration files directly from the browser, streamlining your data logging process. <img  src="https://i.ibb.co/myhxwRz/configuration-setting.png"  alt="Browser-Based Configuration"  />

- **Universal Compatibility:** Run the app on any device, including PCs, laptops, Raspberry Pi, and more, across any OS such as Windows, Linux, Mac, and even on embedded devices capable of running Node.js.<img  src="https://i.ibb.co/dGRxd7N/data-logger-mockup-removebg-preview.png"  alt="Universal Compatibility"  />

## Getting Started

- **Installation:**

1. Clone the repository:
   ```bash
   git clone https://github.com/abhisheksharma1310/data-logger.git
   ```
2. Navigate to the project directory:
   ```
   cd data-logger
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```

- **Access the Application:** Open your web browser and navigate to the URL provided by your administrator (e.g., http://localhost:3000).

## Logging Data

- **Ensure the Device is Connected:** Make sure your sensor device is connected to the serial port.

- **View Real-Time Data:** Real-time data from your sensor will be displayed as it is logged.

- **Today's Logs:** Access today's logs directly from the web interface. These logs are automatically reset at the start of each new day.

## Viewing Logs

- **Select a Date:** Use the interface to choose a date for which you want to view logs.

- **Fetch Logs:** The application will fetch and display logs from both the log file and the database for the selected date.

## Customizing Your Charts

- **Choose Data Points:** Use the checkboxes to select which data items you want to display on your chart.

- **Select Chart Type:** You can choose different chart types (Line, Bar, Pie) for each data item using the dropdown menu.

- **Edit Labels and Colors:** Customize the chart's label, background color, border color, and border width using the input fields provided.

- **Show Separate Charts:** Toggle the checkbox if you want to display each data item in separate charts.

## Contributing

> We welcome contributions! Please fork the repository and submit a pull request.
