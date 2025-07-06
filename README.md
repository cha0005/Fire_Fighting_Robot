# 🔥 FireBot: IoT Fire Detection & Suppression Robot
A real-time web application displaying sensor data from an ESP8266-powered FireBot robot. Monitors flame, temperature, gas, obstacles, water level, and pump status via Firebase.

# ✨ Features
Real-time Fire Detection: Utilizes flame and gas/smoke sensors to identify fire threats.
Fire Proximity Sensing: Employs a temperature sensor (DHT11) to gauge the proximity of a fire source.
Obstacle Avoidance: Uses an ultrasonic sensor for navigation and avoiding collisions.
Water Level Monitoring: Checks for water availability in the suppression tank.
Automated Water Suppression: Activates a water pump when fire is detected and water is available.
Real-time Web Dashboard: A user-friendly web interface and an Android mobile application which displays all sensor data and robot statuses live.
Wi-Fi Connectivity: The robot connects to Wi-Fi to transmit data to the cloud (Firebase).

# 🛠️ Technologies Used
# Hardware (Robot)
Microcontroller: ESP8266 (NodeMCU) - The brain of the robot, enabling Wi-Fi connectivity and processing.
Flame Sensor: Detects the presence of flames.
MQ-2 Gas/Smoke Sensor: Detects combustible gases and smoke.
DHT11 Temperature/Humidity Sensor: Measures ambient temperature (used for fire proximity) and humidity.
HC-SR04 Ultrasonic Sensor: Measures distance to obstacles.
Water Level Sensor: Detects if water is present in the tank (e.g., float switch).
Water Pump: For fire suppression.
L298N Motor Driver: Controls the robot's motors for movement.
Servo Motor: For directing the water spray.
Wheel Encoders (Placeholders): For basic odometry (movement tracking).

# Software
Arduino IDE: Development environment for programming the ESP8266.
Firebase Realtime Database: Cloud-hosted NoSQL database for real-time data storage and synchronization.

# Libraries (Arduino):
ESP8266WiFi: For Wi-Fi connectivity.
FirebaseESP8266: For direct communication with Firebase Realtime Database.
ArduinoJson: For creating JSON data payloads.
DHT: For interfacing with the DHT11 sensor.
Servo: For controlling the servo motor.

# Web Technologies (Dashboard):
HTML5: Structure of the web dashboard.
CSS3: Styling and layout (style.css).
JavaScript (ES6+): Dynamic content and real-time data fetching from Firebase (app.js).
Firebase JavaScript SDK: For connecting the web app to the Firebase Realtime Database.

# 🚀 How It Works
The Robot (ESP8266 Sketch)
The ESP8266 board runs an Arduino sketch that acts as the robot's control and communication center:
Initialization: On startup, it connects to the specified Wi-Fi network and establishes a secure connection to the Firebase Realtime Database using a database secret key.
Sensor Reading: Continuously reads data from all connected sensors (flame, gas, DHT temperature, water level, ultrasonic, and encoder placeholders).

# Logic & Control:
It processes the sensor data to determine if a fire is detected (based on flame sensor, or a combination of high gas and temperature).
It activates the water pump if a fire is detected AND water is available in the tank.
It updates a built-in LED to indicate fire detection status.
Data Transmission: Every 3 seconds, the robot packages the latest sensor readings and its operational status (e.g., water level as "Yes/No", flame as "Yes/No", water pump as "Activated/Not Activated", temperature as a numerical value for "Fire Proximity") into a JSON object. This JSON object is then directly sent to the /sensors path in the Firebase Realtime Database.

# The Web Application (Dashboard)
The web dashboard provides a live, user-friendly interface:
Connection: The app.js script in the web page connects to the same Firebase Realtime Database.
Real-time Updates: It uses Firebase's onValue listeners to subscribe to changes at the /sensors path.
Display: Whenever new data arrives from the robot, the dashboard automatically updates, showing the most current status of:

💧 Water In Bottle (Yes/No)

🔥 Flame Detected (Yes/No)

🌡️ Fire Proximity (Temperature in °C)

💨 Gas/Smoke Detection (e.g., "Normal", "Smoke Detected")

🚧 Obstacle Status (e.g., "Clear", "Obstacle Ahead")

ポンプ Water Pump (Activated/Not Activated)

This creates a seamless flow of information from the physical robot to a remote monitoring interface.

# Contributors ✨
![image](https://github.com/user-attachments/assets/ffe59f1e-b712-40e0-b4b4-44b44802c4df)
https://github.com/itsvinz23,

![image](https://github.com/user-attachments/assets/116c7e44-a560-4144-9af9-35a4327194ce)
https://github.com/cha0005,

![image](https://github.com/user-attachments/assets/9ab47219-b575-4a41-a279-5480453c3594)
https://github.com/JayDeRukz,

![image](https://github.com/user-attachments/assets/1440d6a0-95a4-4226-be7f-43dd6306840f)
https://github.com/Ravindurrl,

![image](https://github.com/user-attachments/assets/2dab03f1-7aa3-4bed-8d79-d96f0a8eebb9)
https://github.com/TharushiNK,
