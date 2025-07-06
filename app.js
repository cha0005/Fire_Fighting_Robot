// Import Firebase functions from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your Firebase Configuration (Using the config from your very first provided app.js in this turn)
const firebaseConfig = {
  apiKey: "AIzaSyC_KK4dVPB-ecTDhrYzAR--N4AjDCPHvgOO0", // This is your latest provided API key
  authDomain: "fir-12aea.firebaseapp.com",
  databaseURL: "https://fir-12aea-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-12aea",
  storageBucket: "fir-12aea.firebasestorage.app",
  messagingSenderId: "228280696423",
  appId: "1:228280696423:web:74c269f39a46dc12095ec2",
  measurementId: "G-88MC9LNMZY"
};

// Initialize Firebase app and get a reference to the database service
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Global State for Sensor Statuses ---
const sensorStates = {
  temperature: 'no-data',
  humidity: 'no-data',
  waterTank: 'no-data',
  fireDistance: 'no-data',
  flameDetected: 'no-data'
};

// --- Helper Functions ---

/**
 * Updates a sensor card's value and applies appropriate styling classes.
 * @param {string} elementId - The ID of the HTML element to update.
 * @param {string|number} value - The value to display.
 * @param {string} unit - The unit to append to the value (e.g., ' °C', ' %').
 * @param {boolean} isAlert - True if the value indicates an alert state.
 * @param {boolean} isWarning - True if the value indicates a warning state.
 */
function updateSensorCard(elementId, value, unit = '', isAlert = false, isWarning = false) {
  const element = document.getElementById(elementId);

  if (element) {
    element.innerText = `${value}${unit}`;
    element.className = 'sensor-value'; // Reset classes
    if (isAlert) {
      element.classList.add('alert');
    } else if (isWarning) {
      element.classList.add('warning');
    } else {
      element.classList.add('normal');
    }
  } else {
    console.error(`Element with ID '${elementId}' not found in the DOM.`);
  }
}

/**
 * Updates the overall system status based on individual sensor states.
 */
function updateSystemStatus() {
  const systemStatusElement = document.getElementById('system-status');
  if (systemStatusElement) {
    let overallStatus = 'normal';
    for (const key in sensorStates) {
      if (sensorStates[key] === 'alert' || sensorStates[key] === 'no-data') {
        overallStatus = 'alert';
        break;
      }
      if (sensorStates[key] === 'warning') {
        overallStatus = 'alert';
      }
    }
    systemStatusElement.innerText = overallStatus === 'normal' ? "Normal" : "Alert";
    systemStatusElement.className = `status ${overallStatus}`;
  }
}

/**
 * Displays a custom message box.
 */
function showMessageBox(message, type = 'info') {
  let messageBox = document.getElementById('custom-message-box');
  if (!messageBox) {
    messageBox = document.createElement('div');
    messageBox.id = 'custom-message-box';
    messageBox.className = 'message-box';
    messageBox.innerHTML = `
      <div class="message-box-content">
        <p id="message-box-text"></p>
        <button id="message-box-close">OK</button>
      </div>
    `;
    document.body.appendChild(messageBox);

    const style = document.createElement('style');
    style.innerHTML = `
      .message-box { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }
      .message-box.show { opacity: 1; visibility: visible; }
      .message-box-content { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); text-align: center; max-width: 300px; width: 90%; }
      .message-box-content p { font-size: 1.1rem; margin-bottom: 20px; color: #333; }
      .message-box-content button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background 0.2s ease; }
      .message-box-content button:hover { background: #0056b3; }
      .message-box.error .message-box-content { border-top: 5px solid #dc3545; }
      .message-box.success .message-box-content { border-top: 5px solid #28a745; }
      .message-box.warning .message-box-content { border-top: 5px solid #ffc107; }
      .message-box.info .message-box-content { border-top: 5px solid #007bff; }
    `;
    document.head.appendChild(style);

    document.getElementById('message-box-close').addEventListener('click', () => {
      messageBox.classList.remove('show');
    });
  }
  document.getElementById('message-box-text').innerText = message;
  messageBox.className = `message-box show ${type}`;
}

// --- Realtime Data Listeners ---

// 1. Temperature Sensor
onValue(ref(db, 'sensors/temperature'), snapshot => {
  const temp = snapshot.val();
  if (temp !== null && typeof temp === 'number') {
    let status = 'normal';
    if (temp > 50) { status = 'alert'; } else if (temp > 30) { status = 'warning'; }
    updateSensorCard('temperature-value', temp.toFixed(1), ' °C', status === 'alert', status === 'warning');
    sensorStates.temperature = status;
  } else {
    updateSensorCard('temperature-value', '--', ' °C');
    sensorStates.temperature = 'no-data';
  }
  updateSystemStatus();
});

// 2. Humidity Sensor
onValue(ref(db, 'sensors/humidity'), snapshot => {
  const humidity = snapshot.val();
  if (humidity !== null && typeof humidity === 'number') {
    let status = 'normal';
    if (humidity < 20 || humidity > 80) { status = 'alert'; } else if (humidity < 30 || humidity > 70) { status = 'warning'; }
    updateSensorCard('humidity-value', humidity.toFixed(0), ' %', status === 'alert', status === 'warning');
    sensorStates.humidity = status;
  } else {
    updateSensorCard('humidity-value', '--', ' %');
    sensorStates.humidity = 'no-data';
  }
  updateSystemStatus();
});

// 3. Water Level Sensor (Water in Tank) - FIXED LOGIC
onValue(ref(db, 'sensors/waterTank'), snapshot => {
  const waterStatus = snapshot.val(); // Expecting a string like "Water Detected" or "No Water"
  if (waterStatus !== null && typeof waterStatus === 'string') {
    // Check if the string explicitly means "water detected"
    const isWaterDetected = (waterStatus.toLowerCase() === "water detected");
    const displayValue = isWaterDetected ? "Water Detected" : "No Water";
    const isAlertState = !isWaterDetected; // Alert if NO water
    updateSensorCard('water-status', displayValue, '', isAlertState);
    sensorStates.waterTank = isAlertState ? 'alert' : 'normal';
  } else {
    updateSensorCard('water-status', '--', '');
    sensorStates.waterTank = 'no-data';
  }
  updateSystemStatus();
});

// 4. Fire Distance Sensor
onValue(ref(db, 'sensors/fireDistance'), snapshot => {
  const distance = snapshot.val();
  if (distance !== null && typeof distance === 'number') {
    let status = 'normal';
    if (distance < 10) { status = 'alert'; } else if (distance < 50) { status = 'warning'; }
    updateSensorCard('fire-distance-value', distance.toFixed(1), ' m', status === 'alert', status === 'warning');
    sensorStates.fireDistance = status;
  } else {
    updateSensorCard('fire-distance-value', '--', ' m');
    sensorStates.fireDistance = 'no-data';
  }
  updateSystemStatus();
});

// 5. Flame Detection Sensor - FIXED LOGIC
onValue(ref(db, 'sensors/flameDetected'), snapshot => {
  const flameStatus = snapshot.val(); // Expecting a string like "Flame Detected" or "No Fire"
  if (flameStatus !== null && typeof flameStatus === 'string') {
    // Check if the string explicitly means "flame detected"
    const isFlameDetected = (flameStatus.toLowerCase() === "flame detected");
    const displayValue = isFlameDetected ? "Flame Detected" : "No Fire";
    const isAlertState = isFlameDetected; // Alert if FLAME detected
    updateSensorCard('flame-status', displayValue, '', isAlertState);
    sensorStates.flameDetected = isAlertState ? 'alert' : 'normal';
  } else {
    updateSensorCard('flame-status', '--', '');
    sensorStates.flameDetected = 'no-data';
  }
  updateSystemStatus();
});


// 6. Gas/Smoke Detection
onValue(ref(db, 'sensors/gasSmoke'), snapshot => {
  const status = snapshot.val();
  const gasStatusElement = document.getElementById('gas-status');
  if (status !== null && typeof status === 'string') {
    gasStatusElement.innerText = status;
    gasStatusElement.className = `status ${status.toLowerCase() !== "normal" ? "alert" : "normal"}`;
    // No specific sensorStates update for gasSmoke in this simplified version,
    // but you can add it if you want it to affect overall system status.
  } else {
    gasStatusElement.innerText = "No Data";
    gasStatusElement.className = "status";
  }
  updateSystemStatus();
});

// 7. Obstacle Status
onValue(ref(db, 'sensors/obstacle'), snapshot => {
  const obs = snapshot.val();
  const obstacleStatusElement = document.getElementById('obstacle-status');
  if (obs !== null && typeof obs === 'string') {
    obstacleStatusElement.innerText = obs;
    obstacleStatusElement.className = `status ${obs.toLowerCase() !== "clear" ? "alert" : "normal"}`;
    // No specific sensorStates update for obstacle in this simplified version.
  } else {
    obstacleStatusElement.innerText = "No Data";
    obstacleStatusElement.className = "status";
  }
  updateSystemStatus();
});

// 8. Water Pump Status
onValue(ref(db, 'sensors/waterPump'), snapshot => {
  const pumpActivated = snapshot.val();
  const waterPumpStatusElement = document.getElementById('water-pump-status');
  if (pumpActivated !== null && typeof pumpActivated === 'boolean') {
    waterPumpStatusElement.innerText = pumpActivated ? "Activated" : "Not Activated";
    waterPumpStatusElement.className = `status ${pumpActivated ? "normal" : "alert"}`;
    // No specific sensorStates update for waterPump in this simplified version.
  } else {
    waterPumpStatusElement.innerText = "No Data";
    waterPumpStatusElement.className = "status";
  }
  updateSystemStatus();
});


// Emergency Activate Button functionality
document.addEventListener('DOMContentLoaded', () => {
  const activateButton = document.getElementById('activate-emergency');
  if (activateButton) {
    activateButton.addEventListener('click', async () => {
      console.log("Emergency ACTIVATE button clicked!");
      try {
        // Example: Write 'true' to 'commands/emergencyActivate' in Firebase
        await set(ref(db, 'commands/emergencyActivate'), true);
        showMessageBox("Emergency Activation Initiated!", 'success');
      } catch (error) {
        console.error("Error activating emergency:", error);
        showMessageBox(`Failed to activate emergency: ${error.message}`, 'error');
      }
    });
  }
});

// Initial update of system status when the page loads
document.addEventListener('DOMContentLoaded', updateSystemStatus);
