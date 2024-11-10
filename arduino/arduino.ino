#include <ArduinoJson.h>
#include <DHT.h>

#define DHTPIN 2       // DHT sensor pin
#define DHTTYPE DHT11  // DHT11 or DHT22
#define LEDPIN 13      // LED pin

DHT dht(DHTPIN, DHTTYPE);
String command = "";

// Allocate the JSON document
JsonDocument doc;

void setup() {
  // Initialize Serial port
  Serial.begin(9600);
  dht.begin();  // Initialize DHT sensor
  pinMode(LEDPIN, OUTPUT);
  digitalWrite(LEDPIN, LOW);  // Turn LED off initially
  while (!Serial)
    continue;
}

void loop() {
  float temp = dht.readTemperature();  // Read temperature
  float humidity = dht.readHumidity();  // Read humidity

  if (Serial.available()) {
    command = Serial.readStringUntil('\n');  // Read command from serial
    if (command == "LED_ON") {
      digitalWrite(LEDPIN, HIGH);  // Turn LED on
      Serial.println("LED is ON");
    } else if (command == "LED_OFF") {
      digitalWrite(LEDPIN, LOW);  // Turn LED off
      Serial.println("LED is OFF");
    } else if (command == "READ_TEMP") {
      float temp = dht.readTemperature();  // Read temperature
      Serial.println("Temperature: " + String(temp) + "C");
    }
  }

  // Add values in the document
  doc["temperature"] = temp;
  doc["humidty"] = humidity;

  // Add an array.
  // JsonArray data = doc["data"].to<JsonArray>();
  // data.add(48.756080);
  // data.add(2.302038);
  // Generate the minified JSON and send it to the Serial port.
  serializeJson(doc, Serial);
  // The above line prints:
  // {"sensor":"gps","time":1351824120,"data":[48.756080,2.302038]}

  // Start a new line
  Serial.println();

  // Generate the prettified JSON and send it to the Serial port.
  //serializeJsonPretty(doc, Serial);
  // The above line prints:
  // {
  //   "sensor": "gps",
  //   "time": 1351824120,
  //   "data": [
  //     48.756080,
  //     2.302038
  //   ]
  // }

  //add delay of 5 seconds
  delay(30000);
}