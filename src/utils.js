// Serializes a <form> element into an object
function serializeForm(form) {
  const formData = new FormData(form);
  const data = {};

  for (const key of formData.keys()) {
    data[key] = formData.get(key);
  }

  return data;
}

// Left padding, takes a number (`n`) and the wanted length (eg. 2 = 01)
function pad(n, length = 2, char = '0') {
  const nr = String(n);
  
  if (nr.length >= length) {
    return nr;
  }

  const padding = char.repeat(length - nr.length);

  return `${padding}${nr}`;
}

// From: https://stackoverflow.com/a/6444043
function increaseBrightness(hex, percent){
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length == 3){
    hex = hex.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

  return '#'
    + ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1)
    + ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1)
    + ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

export default {
  serializeForm,
  pad,
  increaseBrightness,
};
