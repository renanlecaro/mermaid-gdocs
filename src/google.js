export function loadStartCode(cb) {
  if (!window.google) return cb('');
  window.google.script.run
    .withFailureHandler(err => alert(err))
    .withSuccessHandler(source => cb(source))
    .withUserObject(this)
    .getSourceOfSelectedItem();
}

export function applyChanges(lastCorrectCode, base64,width, height) {
  console.log(lastCorrectCode, base64);

  if (!window.google) return window.open(base64)
  window.google.script.run
    .withFailureHandler(msg => alert(msg))
    .withSuccessHandler(() => google.script.host.close())
    .withUserObject(this)
    .insertImage(lastCorrectCode, base64,width, height);
}

export function cancelEdit(){ 
  if (!window.google) return  
    google.script.host.close()
}