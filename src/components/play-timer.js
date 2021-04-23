function PlayTimer(el, context) {
  const { game } = context.getState();

  if (!game) {
    return el;
  }

  const { start, duration } = game.phase;
  const end = start + duration;

  const interval = context.setInterval(() => {
    const now = Date.now();
    const sec = ((end - now) / 1000).toFixed(1);
    el.textContent = `${sec}s`;

    if (sec <= 0) {
      clearInterval(interval);
    }
  });
}

export default PlayTimer;
