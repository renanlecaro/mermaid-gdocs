
export function svgAsPng(mySVG, cb) { 
  var can = document.createElement('canvas'), // Not shown on page
    ctx = can.getContext('2d'),
    loader = new Image(); // Not shown on page
  const {width, height}=mySVG.getBoundingClientRect()
  mySVG.setAttribute('width', width)
  mySVG.setAttribute('height', height)
  loader.width = can.width = width*2
  loader.height = can.height =height*2
  loader.onload = function() {
    ctx.drawImage(loader, 0, 0, loader.width, loader.height);
    cb(can.toDataURL(),loader.width, loader.height);
  };
  var svgAsXML = new XMLSerializer().serializeToString(mySVG);
  loader.src = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);
}
