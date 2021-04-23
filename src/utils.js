// Serializes a <form> element into an object
function serializeForm(form) {
  const formData = new FormData(form);
  const data = {};

  for (const key of formData.keys()) {
    data[key] = formData.get(key);
  }

  return data;
}

export default {
  serializeForm,
};
