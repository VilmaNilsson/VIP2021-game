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

export default {
  serializeForm,
  pad,
};
