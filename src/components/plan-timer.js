import utils from '../utils';

function PlanTimer(el, context) {
  const { game } = context.getState();

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
      // const i = utils.pad(time.milliseconds);
      // el.textContent = `${m} : ${s} : ${i}`;
      el.textContent = `${m} : ${s}`;
    },
  }, 100);
}

export default PlanTimer;
