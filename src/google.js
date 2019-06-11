export function applyChanges(lastCorrectCode, base64, width, height) {
  console.log(lastCorrectCode, base64);

  if (!window.google) return window.open(base64);
  window.google.script.run
    .withFailureHandler(msg => alert(msg))
    .withSuccessHandler(() => google.script.host.close())
    .withUserObject(this)
    .insertImage(lastCorrectCode, base64, width, height);
}

export function cancelEdit() {
  if (!window.google) return;
  google.script.host.close();
}
