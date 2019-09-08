import './index.css';
import { applyChanges, cancelEdit} from './google.js';
import {svgAsPng} from './svgAsPng.js';
import {debounce} from './debounce.js';
function byId(id) {
  let res = document.getElementById(id);
  if (!res) console.log('no result for id ' + id);
  return res;
}

const mermaid = window.mermaid;

let lastCorrectCode = '';
let theme='';


const renderPreview = debounce(function() {

  var source = byId('code').value.trim();
  var oldHTML = byId('preview').innerHTML;
  console.log(source, theme)
  try {
    mermaid.parse(source);
    byId('preview').setAttribute('data-processed', '');
    byId('preview').innerHTML = source;

    mermaid.initialize({
      startOnLoad: false,
      theme,
    });
    mermaid.init(undefined, byId('preview'));
    byId('code').style.border = '';
    lastCorrectCode = source;
  } catch (e) {
    console.error(e);
    byId('preview').innerHTML = oldHTML;
    byId('code').style.border = '1px solid red';
  }
}, 100);

const defaultContent = `graph LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
`;

function setCode(source) {
  byId('code').value = source || defaultContent;
  renderPreview();
}

window.setup = function(json, buttonLabel) {
  // Fallback for previous version that didn't store the theme
  let parsed={
    source:json,
    theme:localStorage.getItem('favorite-theme') || 'neutral'
  }
  try{
    parsed=JSON.parse(json)
  }catch(e){

  }
  theme=parsed.theme
  byId('theme').value=theme
  try {
    if (buttonLabel) {
      byId('submit').innerText = buttonLabel;
    }
    mermaid.initialize({
      startOnLoad: false,
      theme: parsed.theme,
    });
    byId('code').addEventListener('keyup', e => renderPreview());
    setCode(parsed.source);

    byId('form').addEventListener('submit', function(e) {
      e.preventDefault();

      let svg = document.getElementsByTagName('svg')[0];
      svgAsPng(svg, (base64, width, height) => {
        applyChanges(JSON.stringify({theme, source:lastCorrectCode }), base64, width, height);
      });
    });
  } catch (e) {
    console.error(e);
  }
};

byId('cancel').addEventListener('click', e => {
  e.preventDefault();
  cancelEdit();
});

byId('theme').addEventListener('change', e => {
  theme=e.target.value;
  localStorage.setItem('favorite-theme',theme)
  renderPreview()
});

if (!window.google) window.setup();
