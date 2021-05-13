function PlayTimer(el, context) {

  const { game } = context.getState();

 

  // If there is no game we cant render anything

  if (!game) {

    return el;

  }

 

  el.className = "timer";

 

  const { start, duration } = game.phase;

  // The end time (ie. 'that many seconds far ahead')

  const end = start + duration;

 

  const interval = context.setInterval(() => {

    // We take a timestamp ('now' in seconds)

    const now = Date.now();

    // Calculate how many seconds are left

    const sec = ((end - now) / 1000).toFixed(2);

 

    let minutes = Math.floor(sec / 60);

    let seconds = Math.floor(sec) - minutes * 60;

    let dixsec = Math.floor((sec - Math.floor(sec)) * 10);

    let centsec = Math.floor((sec - Math.floor(sec)) * 100 - dixsec * 10);

    minutes = (minutes < 10) ? '0' + minutes : minutes;

    seconds = (seconds < 10) ? '0' + seconds : seconds;

    dixsec = (dixsec == 0) ? '0' : dixsec;

    centsec = (centsec == 0) ? '0' : centsec;

    let timerString = minutes + ':' + seconds + ':' + dixsec + centsec;

    el.textContent = `${timerString}`;

           

    // If none are, stop our interval

    if (sec <= 0) {

      clearInterval(interval);

    }

  });

}

 

export default PlayTimer;

