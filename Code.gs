
function onOpen() {
  DocumentApp.getUi() 
      .createMenu('Dialog')
      .addItem('Edit', 'openDialog')
      .addToUi();
}

function openDialog() {
 
  var html = HtmlService.createHtmlOutputFromFile('index')
      .setWidth(1200)
    .setHeight(800);
  
  DocumentApp.getUi()
      .showModalDialog(html, 'Graph editor')
}

function findSelectedImage(){
 var selection=DocumentApp.getActiveDocument().getSelection();
    
  if (selection) {
    var elements = selection.getRangeElements();
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i].getElement()
  
      // Only modify elements that can be edited as text; skip images and other non-text elements.
      if (element.getType()==DocumentApp.ElementType.INLINE_IMAGE && 
      element.asInlineImage().getAltTitle() == 'mermaid-graph') {
      return element.asInlineImage()
   
      }
    }
  }
  
}

function getSourceOfSelectedItem(){
 var selected=findSelectedImage()
 if(selected) return selected.getAltDescription()  
}

function insertImage(source, base64){
  var blob=Utilities.newBlob(Utilities.base64Decode(base64.split(',')[1]), 'image/png', "mermaid-chart.png");
  
 var selected=findSelectedImage()
   
  var cursor=DocumentApp.getActiveDocument().getCursor(),posImage=null;
  
  if(selected){
    var parent = selected.getParent();
    posImage= parent.insertInlineImage(parent.getChildIndex(selected)+1, blob) ;
    selected.removeFromParent();
  }
  
  if(!posImage && cursor){
    posImage=cursor.insertInlineImage(blob)
  }
  
  if(!posImage){
    // No cursor or coud not insert
  var body = DocumentApp.getActiveDocument().getBody();
    var paragraph = body.appendParagraph('')
    posImage   = paragraph.appendInlineImage(blob);
  }

 
  posImage.setAltDescription(source);
  posImage.setAltTitle('mermaid-graph')
}
