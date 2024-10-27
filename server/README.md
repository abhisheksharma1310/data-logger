API Documentation
Base URL
The base URL is configurable by the user, for example: http://localhost:5000

Endpoints

1. Configure Serial Port
   URL: /serial/configure

Method: POST

Description: Configures the serial port and logging details. Saves configuration to serialLog.config.json.

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

2. Start Data Logging
   URL: /serial/start-logging

Method: POST

Description: Starts data logging based on the saved configuration in serialLog.config.json.

Request Body: Empty

Response:

200 OK: { "message": "Data logging started" }

500 Internal Server Error: { "message": "Failed to open port: <error message>" }

3. Retrieve Logs by Date
   URL: /serial/logs/:date

Method: GET

Description: Retrieves logs from both file and database for the specified date.

URL Params:

date: Date in YYYY-MM-DD format.

Response:

200 OK: [<logs>]

500 Internal Server Error: { "message": "<error message>" }

4. Delete Logs by Date
   URL: /serial/logs/:date

Method: DELETE

Description: Deletes logs from both file and database for the specified date.

URL Params:

date: Date in YYYY-MM-DD format.

Response:

200 OK: { "message": "Logs deleted successfully" }

500 Internal Server Error: { "message": "<error message>" }

Example Requests
Configure Serial Port
bash

Copy
curl -X POST http://localhost:5000/serial/configure \
 -H 'Content-Type: application/json' \
 -d '{
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
}'
Start Data Logging
bash

Copy
curl -X POST http://localhost:5000/serial/start-logging
Retrieve Logs by Date
bash

Copy
curl -X GET http://localhost:5000/serial/logs/2024-10-25
Delete Logs by Date
bash

Copy
curl -X DELETE http://localhost:5000/serial/logs/2024-10-25
