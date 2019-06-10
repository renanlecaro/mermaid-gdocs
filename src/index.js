import './index.css';
import './setupHTML.js';
import $ from 'jquery';
import mermaid from 'mermaid';
import {loadStartCode, applyChanges} from './google.js';

var $form = $('#myform'),
  $code = $('#code'),
  preview = $('#preview_content'),
  lastCorrectCode = '';

const renderPreview = debounce(function() {
  var source = $code.val();
  var oldHTML = $('#preview').html();
  try {
    $('#dpreview_content').remove();
    $('#preview').html('<div id="preview_content"/>'); 
    mermaid.parse(source)
    $('#preview_content').text(source)
    mermaid.init(undefined, $('#preview_content')[0]) 
    $code.css('border', '');
  } catch (e) {
    $('#preview').html(oldHTML);
    $code.css('border', '1px solid red');
  }
}, 250);

const defaultContent = `
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`;
loadStartCode(source => {
  if (source) {
    $('#submit').text('Update');
  }
  source = source || defaultContent;
  $code.val(source);
  mermaid.initialize({
    startOnLoad: false,
    theme: 'forest',
  });
  $code.on('keyup', e => renderPreview());
  renderPreview();

  $form.submit(function(e) {
    e.preventDefault();

    let svg = document.getElementById('preview_content');
    svgAsPng(svg, base64 => {
      applyChanges(lastCorrectCode, base64);
    });
  });
});

function svgAsPng(mySVG, cb) {
  var can = document.createElement('canvas'), // Not shown on page
    ctx = can.getContext('2d'),
    loader = new Image(); // Not shown on page

  loader.width = can.width = mySVG.getAttribute('width');
  loader.height = can.height = mySVG.getAttribute('height');
  loader.onload = function() {
    ctx.drawImage(loader, 0, 0, loader.width, loader.height);
    cb(can.toDataURL());
  };
  var svgAsXML = new XMLSerializer().serializeToString(mySVG);
  loader.src = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
