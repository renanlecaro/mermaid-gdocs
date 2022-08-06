export function applyChanges(lastCorrectCode, base64, width, height) {

  console.log(lastCorrectCode, base64);
  if (window.google) {
    window.google.script.run
      .withFailureHandler(msg => alert(msg))
      .withSuccessHandler(() => google.script.host.close())
      .withUserObject(this)
      .insertImage(lastCorrectCode, base64, width, height);
  }else{
      var win = window.open("");
      win.document.body.innerHTML = `
        <html>
        <head><title>Redendered png preview</title></head>
        <body>
        <h1>Preview of the png</h1>
        <p>You are running the addon outside of google docs, here's a preview of what gdocs would receive</p>
        <img src="${base64}"/>
        </body>
      </html>
    `
  }

}

export function cancelEdit() {
  if (!window.google) return;
  google.script.host.close();
}
