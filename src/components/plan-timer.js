function PlanTimer(el, context) {
  const { game } = context.getState();

  // If there is no game we cant render anything
  if (!game) {
    return el;
  }

  const { start, duration } = game.phase;
  // The end time (ie. 'that many seconds far ahead')
  const end = start + duration;

  const interval = context.setInterval(() => {
    // We take a timestamp ('now' in seconds)
    const now = Date.now();
    // Calculate how many seconds are left
    const sec = ((end - now) / 1000).toFixed(1);

    let min = Math.floor(sec / 60);
    let remSec = Math.floor(sec % 60);

    if (remSec < 10) {
      remSec = 0 + remSec;
    }
    if (min < 10) {
      min = 0 + min;
    }

    el.textContent = `${min} : ${remSec}`;

    // If none are, stop our interval
    if (sec <= 0) {
      clearInterval(interval);
    }
  });
}

export default PlanTimer;
