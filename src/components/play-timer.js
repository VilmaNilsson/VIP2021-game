import utils from '../utils';

function PlayTimer(el, context) {
  const { game, player } = context.getState();

  // If there is no game we cant render anything
  if (!game) {
    return el;
  }

  const { teams } = game;
  const { team } = player;
  const teamColor = teams[team].color;

  el.style.color = teamColor;

  const { start, duration } = game.phase;

  context.setInterval({
    start,
    duration,
    onTick: (time) => {
      const m = utils.pad(time.minutes);
      const s = utils.pad(time.seconds);
      // const i = utils.pad(time.milliseconds);
      // el.textContent = `${m} : ${s} : ${i}`;
      el.textContent = `${m}:${s}:00`;
    },
  }, 100);
}

export default PlayTimer;
