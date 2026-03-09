const title = document.getElementById("mode-title");
const display = document.getElementById("display");
const start = document.getElementById("start");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");
const clear = document.getElementById("clear");
const progressBar = document.getElementById("bar");
const countDisplay = document.getElementById("session-count");
const iconsDisplay = document.querySelectorAll("#session-icons span");

const SECOND = 1;
const MINUTE = 60
const HOUR = MINUTE * 60;
const SESSIONS = 4;
const workTime = MINUTE * 25;
const shortBreak = MINUTE * 5;
const longBreak = MINUTE * 20;
const pulseClass = "pulse-warning";

const sound = new Audio("./assets/audio/alarm.mp3");
const audioCtx = new window.AudioContext();

let intervalId = null;
let tickToggle = true;
let isWorkPhase = true;
let timeLeft = workTime
let initialTime = timeLeft;
let breakTime = shortBreak;
let completedSessions = parseInt(localStorage.getItem("completedSessions")) || 0;


const formatTime = (time) => {
  const h = String(Math.floor(time / HOUR)).padStart(2, "0");
  const m = String(Math.floor((time % HOUR) / MINUTE)).padStart(2, "0");
  const s = String(time % MINUTE).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const playTick = () => {
  // If the context is paused (by the browser), we resume it
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(tickToggle ? 900 : 600, audioCtx.currentTime); // Frequency in Hz
  // Smooth fade out to avoid clicking
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1); // Duration 0.1 sec
  tickToggle = !tickToggle;
};

const sendNotification = (title, message) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body: message,
      icon: "./assets/icons/timer-icon.png"
    });
    // Close the notification automatically after 5 seconds
    setTimeout(() => notification.close(), 5000);
    // When clicking on the notification, we return the user to the tab
    notification.onclick = () => {
      window.focus();
    };
  }
};

const playPulse = () => {
  display.classList.add(pulseClass);
  setTimeout(() => {
    display.classList.remove(pulseClass);
  }, 100);
};

const resetTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
  start.disabled = false;
  breakTime = completedSessions === SESSIONS ? longBreak : shortBreak;
  timeLeft = isWorkPhase ? workTime : breakTime;
  initialTime = timeLeft;
  display.textContent = formatTime(timeLeft);
  progressBar.classList.remove("low-time");
  progressBar.style.width = "100%";
  display.classList.remove(pulseClass);
  title.textContent = isWorkPhase 
    ? "💻 Working hours" 
    : `${completedSessions === SESSIONS ? "🕹️ Long" : "☕ Short"} Break`;
  title.style.color = isWorkPhase ? "#f44336" : "#4caf50";
};

const updateProgressBar = () => {
  const progressPercent = (timeLeft / initialTime) * 100;
  progressBar.style.width = `${progressPercent}%`;

  if (progressPercent < 20) {
    progressBar.classList.add("low-time");
  } else {
    progressBar.classList.remove("low-time");
  }
};

const displaySessions = () => {
  for (let i = 0; i < completedSessions; i++) {
    iconsDisplay[i]?.classList.add("success");
  }
  countDisplay.textContent = `${completedSessions}/${SESSIONS}`;
};

const clearSessions = () => {
  completedSessions = 0;
  iconsDisplay.forEach((icons) => {
    icons.classList.remove("success");
  });
  displaySessions();
  localStorage.removeItem("completedSessions");
};

const updateUI = () => {
  if (timeLeft <= 0) {
    if (completedSessions === SESSIONS) {
      clearSessions();
    }
    if (isWorkPhase) {
      completedSessions += 1;
      displaySessions();
      localStorage.setItem("completedSessions", completedSessions);
      // SENDING NOTIFICATION
      sendNotification("Congrats!", "Time to take a break.");
    } else {
      sendNotification("Break is over!", "Time to get back to work.");
    }
    isWorkPhase = !isWorkPhase;
    resetTimer();
    sound.play();
    return;
  }

  if (timeLeft < 10) {
    playTick();
    playPulse();
  }

  timeLeft -= 1;
  display.textContent = formatTime(timeLeft);

  updateProgressBar();
};

const requestNotificationPermission = () => {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
};

/****************** Launch of the App ************************/

display.textContent = formatTime(timeLeft);
// After we red local storage we need to display sessions
displaySessions();

start.addEventListener("click", () => {
  requestNotificationPermission(); // We ask once at the first launch
  if (intervalId) return;
  sound.pause();
  sound.currentTime = 0;
  start.disabled = true;
  intervalId = setInterval(updateUI, 1000);
});

pause.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = null;
  start.disabled = false;
});

reset.addEventListener("click", () => {
  resetTimer();
  sound.pause();
});

clear.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear sessions?")) {
    clearSessions();
    isWorkPhase = true;
    resetTimer();
  }
});
