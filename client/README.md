Frontend User Documentation
Overview
This documentation covers the functionalities provided by the backend API for serial port configuration, data logging, and log retrieval. The API allows users to:

Configure the serial port and logging settings.

Start data logging.

Retrieve logs by date.

Delete logs by date.

Automate log deletion based on settings.

Base URL
The base URL is configurable by the user, for example: http://localhost:5000

API Endpoints

1. Configure Serial Port
   URL: /serial/configure

Method: POST

Description: Configures the serial port and logging details. Saves the configuration to serialLog.config.json.

Request Body:

json

Copy
{
"comport": "COM15",
"baudrate": 9600,
"logToFile": true,
"logToDatabase": false,
"mongoConfig": {
"url": "mongodb://localhost:27017/dataLogger"
},
"fileFormat": "text",
"autoLog": true,
"autoDelete": {
"enabled": true,
"deleteAfterDays": 7
}
}
Response:

200 OK: { "message": "Port opened successfully" }

500 Internal Server Error: { "message": "Error: <error message>" }

Example Request:
javascript

Copy
fetch('http://localhost:5000/serial/configure', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
comport: 'COM15',
baudrate: 9600,
logToFile: true,
logToDatabase: false,
mongoConfig: { url: 'mongodb://localhost:27017/dataLogger' },
fileFormat: 'text',
autoLog: true,
autoDelete: { enabled: true, deleteAfterDays: 7 }
})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error)); 2. Start Data Logging
URL: /serial/start-logging

Method: POST

Description: Starts data logging based on the saved configuration in serialLog.config.json.

Request Body: Empty

Response:

200 OK: { "message": "Data logging started" }

500 Internal Server Error: { "message": "Failed to open port: <error message>" }

Example Request:
javascript

Copy
fetch('http://localhost:5000/serial/start-logging', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error)); 3. Retrieve Logs by Date
URL: /serial/logs/:date

Method: GET

Description: Retrieves logs from both file and database for the specified date.

URL Params:

date: Date in YYYY-MM-DD format.

Response:

200 OK: [<logs>]

500 Internal Server Error: { "message": "<error message>" }

Example Request:
javascript

Copy
fetch('http://localhost:5000/serial/logs/2024-10-25', {
method: 'GET',
headers: {
'Content-Type': 'application/json'
}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error)); 4. Delete Logs by Date
URL: /serial/logs/:date

Method: DELETE

Description: Deletes logs from both file and database for the specified date.

URL Params:

date: Date in YYYY-MM-DD format.

Response:

200 OK: { "message": "Logs deleted successfully" }

500 Internal Server Error: { "message": "<error message>" }

Example Request:
javascript

Copy
fetch('http://localhost:5000/serial/logs/2024-10-25', {
method: 'DELETE',
headers: {
'Content-Type': 'application/json'
}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
Handling Functions for Each User Function
Configure Serial Port
javascript

Copy
const configureSerialPort = async () => {
try {
const response = await fetch('http://localhost:5000/serial/configure', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
comport: 'COM15',
baudrate: 9600,
logToFile: true,
logToDatabase: false,
mongoConfig: { url: 'mongodb://localhost:27017/dataLogger' },
fileFormat: 'text',
autoLog: true,
autoDelete: { enabled: true, deleteAfterDays: 7 }
})
});
const data = await response.json();
console.log(data);
} catch (error) {
console.error('Error:', error);
}
};
Start Data Logging
javascript

Copy
const startDataLogging = async () => {
try {
const response = await fetch('http://localhost:5000/serial/start-logging', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
}
});
const data = await response.json();
console.log(data);
} catch (error) {
console.error('Error:', error);
}
};
Retrieve Logs by Date
javascript

Copy
const getLogsByDate = async (date) => {
try {
const response = await fetch(`http://localhost:5000/serial/logs/${date}`, {
method: 'GET',
headers: {
'Content-Type': 'application/json'
}
});
const data = await response.json();
console.log(data);
} catch (error) {
console.error('Error:', error);
}
};
Delete Logs by Date
javascript

Copy
const deleteLogsByDate = async (date) => {
try {
const response = await fetch(`http://localhost:5000/serial/logs/${date}`, {
method: 'DELETE',
headers: {
'Content-Type': 'application/json'
}
});
const data = await response.json();
console.log(data);
} catch (error) {
console.error('Error:', error);
}
