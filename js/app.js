const SECOND = 1;
const MINUTE = 60
const HOUR = MINUTE * 60;

const sound = new Audio("./assets/audio/alarm.mp3");

function createTimer(displayId, startId, pauseId, resetId, initialTime) {
  const display = document.getElementById(displayId);
  const start = document.getElementById(startId);
  const pause = document.getElementById(pauseId);
  const reset = document.getElementById(resetId);

  let timeLeft = initialTime;
  let intervalId = null;

  const formatTime = (time) => {
    const h = String(Math.floor(time / HOUR)).padStart(2, "0");
    const m = String(Math.floor((time % HOUR) / MINUTE)).padStart(2, "0");
    const s = String(time % MINUTE).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const updateUI = () => {
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      start.disabled = false;
      display.textContent = "Time's up!";
      sound.play();
      return;
    }

    timeLeft -= 1;
    display.textContent = formatTime(timeLeft);
  };

  const resetInterval = () => {
    clearInterval(intervalId);
    intervalId = null;
    start.disabled = false;
  };

  start.addEventListener("click", () => {
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
    sound.pause();
  });
}

createTimer("display-1", "start-1", "pause-1", "reset-1", MINUTE * 25);
createTimer("display-2", "start-2", "pause-2", "reset-2", MINUTE * 5);