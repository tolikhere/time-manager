# Focus Timer

A stylish and functional productivity timer built in pure JavaScript using modern Web APIs.

## 🚀 Key Features
- **Tick-Tack**: Clock sound generated via the **Web Audio API** (no external audio files required for ticking).
- **Smart Notifications**: Browser push notifications notify you when your session ends, even if the tab is minimized.
- **Auto Cycle**: Automatically switches between "Focus" (25 min) and "Relax" (5 min) modes.
- **Visual Feedback**:
- Progress bar changing from green to red.
- Pulsating numbers in time with the sound.
- **Progress Saving**: Your completed sessions are saved in **LocalStorage** and don't disappear after a page refresh.

## 🛠 Technologies
- **HTML5 & CSS3**
- **Vanilla JavaScript** (ES6+)
- **Web Audio API** (on-the-fly sound synthesis)
- **Notifications API** (OS interaction)
- **LocalStorage** (statistics storage)
- **Worker**

## 📦 How to Run Locally
1. Clone the repository:
```bash
git clone git@github.com:tolikhere/time-manager.git
```
2. Open **index.html** in your browser
