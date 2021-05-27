import utils from '../utils';

function PlanTimer(el, context) {
  const { game, player } = context.getState();

  // If there is no game we cant render anything
  if (!game) {
    return el;
  }

  const { start, duration } = game.phase;

  context.setInterval({
    start,
    duration,
    onTick: (time) => {
      const m = utils.pad(time.minutes);
      const s = utils.pad(time.seconds);
      const i = utils.pad(Math.floor(time.milliseconds / 10));
      el.textContent = `${m}:${s}:${i}`;
    },
  }, 50);
}

export default PlanTimer;
