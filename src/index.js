import './index.css'; 
import {loadStartCode, applyChanges,cancelEdit} from './google.js';
import {svgAsPng} from './svgAsPng.js';
import {debounce} from './debounce.js';
function byId(id){
  let res=document.getElementById(id);
  if(!res) console.log('no result for id ' +id);
  return res;
} 
 
const mermaid=window.mermaid

let lastCorrectCode=''
const renderPreview = debounce(function() {
  var source = byId('code').value;
  var oldHTML = byId('preview').innerHTML;
  try {
    mermaid.parse(source)
    byId('preview').setAttribute('data-processed', ''); 
    byId('preview').innerHTML=source; 
    mermaid.init(undefined, byId('preview')) 
     byId('code').style.border=''
    lastCorrectCode=source;
  } catch (e) {
    console.error(e)
    byId('preview').innerHTML=oldHTML;
    byId('code').style.border= '1px solid red';
  }
}, 250);

const defaultContent = `
graph TD
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`;

loadStartCode(source => {
  if (source) {
    byId('submit').innerText='Update';
  }
  source = source || defaultContent;
  byId('code').value=source;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'forest',
  });
  byId('code').addEventListener('keyup', e => renderPreview());
  renderPreview();

  byId('form').addEventListener('submit',function(e) {
    e.preventDefault();

    let svg = document.getElementsByTagName('svg')[0]
    svgAsPng(svg, (base64, width, height) => {
      applyChanges(lastCorrectCode, base64,width, height);
    });
  });
});

byId('cancel').addEventListener('click',e=>{
  e.preventDefault()
  cancelEdit()
})