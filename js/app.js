const timerDisplay = document.querySelector(".time");
const timerBtn = document.querySelector(".start");
const timerDisplay2 = document.querySelector(".time-2");
const timerBtn2 = document.querySelector(".start-2");
const SECOND = 1;
const MINUTE = 60
const HOUR = MINUTE * 60;
const START_TIME = MINUTE * 25;

const sound = new Audio("./assets/audio/Wink_-_Eien_No_Lady_Doll_-Voyage_Voyage_(Zvyki.com).mp3");


timerBtn.addEventListener("click", () => {
  sound.pause();
  sound.currentTime = 0;
  timerBtn.disabled = true;
  let timeLeft = START_TIME;

  const updateUI = () => {
    if (timeLeft < 0) {
      clearInterval(intervalId);
      timerBtn.disabled = false;
      timerDisplay.textContent = "Time's up!";
      sound.play();
      return;
    }

    const hours = Math.floor(timeLeft / HOUR);
    const minutes = Math.floor((timeLeft % HOUR) / MINUTE);
    const seconds = timeLeft % MINUTE;

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");

    timerDisplay.textContent = `${h}:${m}:${s}`;
    timeLeft -= 1;
  };

  updateUI();
  const intervalId = setInterval(updateUI, 1000);
});

timerBtn2.addEventListener("click", () => {
  sound.pause();
  sound.currentTime = 0;
  timerBtn2.disabled = true;
  let timeLeft = MINUTE * 5;

  const updateUI = () => {
    if (timeLeft < 0) {
      clearInterval(intervalId);
      timerBtn2.disabled = false;
      timerDisplay2.textContent = "Time's up!";
      sound.play();
      return;
    }

    const hours = Math.floor(timeLeft / HOUR);
    const minutes = Math.floor((timeLeft % HOUR) / MINUTE);
    const seconds = timeLeft % MINUTE;

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");

    timerDisplay2.textContent = `${h}:${m}:${s}`;
    timeLeft -= 1;
  };

  updateUI();
  const intervalId = setInterval(updateUI, 1000);
});
