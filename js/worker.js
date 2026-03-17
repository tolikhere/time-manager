let intervalId = null;

self.onmessage = (e) => {
  if (e.data === "start") {
    intervalId = setInterval(() => {
      self.postMessage("tick");
    }, 100); // (100ms) for a smoother bar
  } else if (e.data === "stop") {
    clearInterval(intervalId);
  }
};
