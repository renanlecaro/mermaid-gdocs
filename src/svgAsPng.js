export function svgAsPng(mySVG, cb) {
  // Make svg take as much s
  const superScaling = 2;
  var can = document.createElement('canvas'), // Not shown on page
    ctx = can.getContext('2d'),
    loader = new Image(); // Not shown on page

  const vb = mySVG.getAttribute('viewBox').split(' ');

  let width = parseInt(vb[2]),
    height = parseInt(vb[3]);

  if (!width || !height) {
    let bound = mySVG.getBoundingClientRect();
    width = bound.width;
    height = bound.height;
  }

  mySVG.setAttribute('width', width);
  mySVG.setAttribute('height', height);

  loader.width = can.width = width * superScaling;
  loader.height = can.height = height * superScaling;
  loader.onload = function() {
    ctx.drawImage(loader, 0, 0, loader.width, loader.height);
    cb(can.toDataURL(), loader.width, loader.height);
  };
  var svgAsXML = new XMLSerializer().serializeToString(mySVG);
  loader.src = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);
}
