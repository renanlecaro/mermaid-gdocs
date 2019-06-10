const div = document.createElement('div');
div.innerHTML = `
<form id="myform">
  <div class="left">
    <textarea id="code"></textarea>
    <button type="submit" id="submit">Insert</button> 
  </div>
  <div id="preview"></div>
</form>`;
document.body.appendChild(div);
