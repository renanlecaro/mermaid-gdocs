export function loadStartCode(cb) {
  if (!window.google) return cb('');
  window.google.script.run
    .withFailureHandler(err => alert(err))
    .withSuccessHandler(source => cb(source))
    .withUserObject(this)
    .getSourceOfSelectedItem();
}

export function applyChanges(lastCorrectCode, base64) {
  if (!window.google) return;
  window.google.script.run
    .withFailureHandler(msg => alert(msg))
    .withSuccessHandler(() => google.script.host.close())
    .withUserObject(this)
    .insertImage(lastCorrectCode, base64);
}
