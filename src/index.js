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
  var source = byId('code').value.trim();
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

const defaultContent = `graph LR
  A --> B
`;


function setCode(source){
  byId('code').value=source || defaultContent;
  renderPreview();
}

loadStartCode(source => {
  if (source) {
    byId('submit').innerText='Update';
  } 
  mermaid.initialize({
    startOnLoad: false,
    theme: 'forest',
  });
  byId('code').addEventListener('keyup', e => renderPreview());
  setCode(source);

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

byId('Flowchart').addEventListener('click',e=>{
  e.preventDefault()
  setCode(`
graph LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
`)
})

byId('Sequence').addEventListener('click',e=>{
  e.preventDefault()
  setCode(`sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
        Bob->>Alice: Not so good :(
    else is well
        Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
        Bob->>Alice: Thanks for asking
    end
`)
})

byId('Gantt').addEventListener('click',e=>{
  e.preventDefault()
  setCode(`gantt
   dateFormat  YYYY-MM-DD
   title Adding GANTT diagram functionality to mermaid

   section A section
   Completed task            :done,    des1, 2014-01-06,2014-01-08
   Active task               :active,  des2, 2014-01-09, 3d
   Future task               :         des3, after des2, 5d
   Future task2              :         des4, after des3, 5d

   section Critical tasks
   Completed task in the critical line :crit, done, 2014-01-06,24h
   Implement parser and jison          :crit, done, after des1, 2d
   Create tests for parser             :crit, active, 3d
   Future task in critical line        :crit, 5d
   Create tests for renderer           :2d
   Add to mermaid                      :1d

   section Documentation
   Describe gantt syntax               :active, a1, after des1, 3d
   Add gantt diagram to demo page      :after a1  , 20h
   Add another diagram to demo page    :doc1, after a1  , 48h

   section Last section
   Describe gantt syntax               :after doc1, 3d
   Add gantt diagram to  page      :20h
   Add another diagram to demo page    :48h
`)
})

 