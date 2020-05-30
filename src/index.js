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
    updateSourceCodeLabel()
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

    byId('form').addEventListener('submit', submitGraph);
  } catch (e) {
    console.error(e);
  }
};

function submitGraph(e){
  e.preventDefault();
  byId('submit').disabled=true
  byId('code').disabled=true
  byId('theme').disabled=true
  byId('cancel').disabled=true
   
  byId('form').removeEventListener('submit', submitGraph);

  let svg = document.getElementsByTagName('svg')[0];
  svgAsPng(svg, (base64, width, height) => {
    applyChanges(JSON.stringify({theme, source:lastCorrectCode }), base64, width, height);
  });
}

byId('cancel').addEventListener('click', e => {
  e.preventDefault();
  cancelEdit();
});

byId('theme').addEventListener('change', e => {
  theme=e.target.value;
  localStorage.setItem('favorite-theme',theme)
  renderPreview()
});

function updateSourceCodeLabel(){
  var source = byId('code').value.trim();
  const type=source
    .split(/\n| |:/)
    .map(w=>w.trim())
    .filter(i=>i)[0];
  const {label, link} = getDocsLink(type);
  byId('code-docs-link').innerHTML=`Source code - <a target="_blank" href="${link}">${label} syntax documentation</a>`;
}

function getDocsLink(type){
  console.log({type})
  if(type==="graph"){
    return {
      label: 'Flowchart',
      link: 'https://mermaid-js.github.io/mermaid/#/flowchart'
    }
  } 
  if(type==="sequenceDiagram"){
    return {
      label: 'Sequence diagram',
      link: 'https://mermaid-js.github.io/mermaid/#/sequenceDiagram'
    }
  }
  if(type==="classDiagram"){
    return {
      label: 'Class diagram',
      link: 'https://mermaid-js.github.io/mermaid/#/classDiagram'
    }
  } 
  if(type==="stateDiagram-v2"){
    return {
      label: 'State diagram',
      link: 'https://mermaid-js.github.io/mermaid/#/stateDiagram'
    }
  } 
  if(type==="erDiagram"){
    return {
      label: 'ER diagram ',
      link: 'https://mermaid-js.github.io/mermaid/#/entityRelationshipDiagram'
    }
  }
  if(type==="journey"){
    return {
      label: 'User journey ',
      link: 'https://mermaid-js.github.io/mermaid/#/user-journey'
    }
  }
  if(type==="gantt"){
    return {
      label: 'Gant diagram ',
      link: 'https://mermaid-js.github.io/mermaid/#/gantt'
    }
  }
  if(type==="pie"){
    return {
      label: 'Pie chart ',
      link: 'https://mermaid-js.github.io/mermaid/#/pie'
    }
  }
  return {
    label:'Mermaid',
    link: 'https://mermaid-js.github.io/mermaid/#/n00b-syntaxReference'
  }
}

if (!window.google) window.setup();
