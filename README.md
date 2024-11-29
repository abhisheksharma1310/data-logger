# Data Logger and Chart Visualization

<div width="100%">
   <image src="https://i.ibb.co/nBYGv1G/data-logger-mockup.jpg" />
   <a href="https://abhisheksharma1310.github.io/data-logger" target="_blank">Click here for live demo</a>
</div>

Welcome to the Data Logger and Chart Visualization application! This tool helps you seamlessly log and visualize sensor data, providing a user-friendly web interface for dynamic chart creation and customization.

# Table of Contents

Overview

Getting Started

Using the Application

Customizing Your Charts

# Overview

1. Log Management: Automatically logs and clears the serial data according to configuration file.

2. Customizable Charts: Select data items to display, choose chart types (Line, Bar, Pie), and customize chart appearance.

3. Real-Time Data: Charts and Table update in real-time as you make changes.

4. Downloadable Charts: Save your charts as images.

5. Option to choose logs storage: Logs can be stored in mongoDB database or in file.

# Getting Started

1. Access the Application: Open your web browser and navigate to the URL provided by your administrator (e.g., http://localhost:3000).

# Using the Application

## Logging Data

1. Ensure the Device is Connected: Make sure your sensor device is connected to the serial port.

2. View Real-Time Data: Real-time data from your sensor will be displayed as it is logged.

3. Today's Logs: Access today’s logs directly from the web interface. These logs are automatically reset at the start of each new day.

## Viewing Logs

1. Select a Date: Use the interface to choose a date for which you want to view logs.

2. Fetch Logs: The application will fetch and display logs from both the log file and the database for the selected date.

# Customizing Your Charts

## Select Data Items

1. Choose Data Points: Use the checkboxes to select which data items you want to display on your chart.

## Choose Chart Type

1. Select Chart Type: You can choose different chart types (Line, Bar, Pie) for each data item using the dropdown menu.

## Customize Chart Appearance

1. Edit Labels and Colors: Customize the chart's label, background color, border color, and border width using the input fields provided.

## Display Options

1. Show Separate Charts: Toggle the checkbox if you want to display each data item in separate charts.

2. Download Chart: Click the "Download Chart as Image" button to save your customized charts as images.
