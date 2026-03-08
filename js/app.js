const SECOND = 1;
const MINUTE = 60
const HOUR = MINUTE * 60;

const sound = new Audio("./assets/audio/alarm.mp3");
const audioCtx = new window.AudioContext();
let tickToggle = true;

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
} 

function createTimer(displayId, startId, pauseId, resetId, barId, initialTime) {
  const display = document.getElementById(displayId);
  const start = document.getElementById(startId);
  const pause = document.getElementById(pauseId);
  const reset = document.getElementById(resetId);
  const progressBar = document.getElementById(barId);
  const pulseClass = "pulse-warning";

  let timeLeft = initialTime;
  let intervalId = null;

  const formatTime = (time) => {
    const h = String(Math.floor(time / HOUR)).padStart(2, "0");
    const m = String(Math.floor((time % HOUR) / MINUTE)).padStart(2, "0");
    const s = String(time % MINUTE).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

const playPulse = () => {
  display.classList.add(pulseClass);
  setTimeout(() => {
    display.classList.remove(pulseClass);
  }, 100);
};

  // displaying currant time programmatically 
  display.textContent = formatTime(timeLeft);

  const updateUI = () => {
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      start.disabled = false;
      display.textContent = "Time's up!";
      progressBar.style.width = "0%";
      progressBar.classList.remove("low-time");
      // SENDING NOTIFICATION
      sendNotification("Timer completed!", "Time to take a break or get back to work.");
      sound.play();
      display.classList.remove(pulseClass);
      return;
    }

    if (timeLeft < 10) {
      playTick();
      playPulse();
    }

    timeLeft -= 1;
    display.textContent = formatTime(timeLeft);

    const progressPercent = (timeLeft / initialTime) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (progressPercent < 20) {
      progressBar.classList.add("low-time");
    } else {
      progressBar.classList.remove("low-time");
    }
  };

  const resetInterval = () => {
    clearInterval(intervalId);
    intervalId = null;
    start.disabled = false;
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  start.addEventListener("click", () => {
    requestNotificationPermission(); // We ask once at the first launch
    if (intervalId) return;
    sound.pause();
    sound.currentTime = 0;
    start.disabled = true;
    intervalId = setInterval(updateUI, 1000);
  });

  pause.addEventListener("click", () => {
    resetInterval();
  });

  reset.addEventListener("click", () => {
    resetInterval();
    timeLeft = initialTime;
    display.textContent = formatTime(timeLeft);
    progressBar.classList.remove("low-time");
    progressBar.style.width = "100%";
    sound.pause();
  });
}

createTimer("display-1", "start-1", "pause-1", "reset-1", "bar-1", MINUTE * 25);
createTimer("display-2", "start-2", "pause-2", "reset-2", "bar-2", MINUTE * 1);