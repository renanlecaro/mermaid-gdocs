/**
 * @OnlyCurrentDoc
 */ 
function onInstall() {
  onOpen(); 
}

function onOpen() {
  DocumentApp.getUi() 
      .createAddonMenu() 
      .addItem('New chart', 'addNewChart')
      .addItem('Edit selected chart', 'editSelectedChart')
      .addToUi();
}

 
function addNewChart(){
  var selected=findSelectedImage()
  if(selected){
    DocumentApp.getUi().alert('You have a chart selected, please unselect it first, or click "edit" to edit it.');
  }else{
    openDialog("graph LR\n  A -->B", 'Insert',"")
  }
}
  

function editSelectedChart(){
  var selected=findSelectedImage()
  if(!selected){
    DocumentApp.getUi().alert('Please select an existing chart created with this app first. Make sure the graph image placement is "in line" or it will not work. ');
  }else{
    let source=selected.getAltDescription();
    let theme= selected.getAltTitle().replace('mermaid-graph/','') || ""

    try{
      // backward compat
      const decoded=JSON.parse(source);
      if(decoded.source){
        source=decoded.source
      }
      if(decoded.theme){
        theme=decoded.theme
      } 
    }catch(e){
    }

    openDialog(source, 'Update', theme)
  }
}

function openDialog(source,label,theme) {
 
  var html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(3000)
    .setHeight(2000)
    .append(`<script>
      window.graphDataFromGoogle=${JSON.stringify({source,label,theme})}
    </script>`) ;


  DocumentApp.getUi()
      .showModalDialog(html, 'Graph editor')
}
 

function findSelectedImage(){
  return DocumentApp.getActiveDocument().getSelection()
  ?.getRangeElements()
  ?.map(rangeElement=>rangeElement.getElement())
  .find(element=>element.getType()==DocumentApp.ElementType.INLINE_IMAGE &&  element.asInlineImage().getAltTitle()?.startsWith('mermaid-graph'))
  ?.asInlineImage() 
}
 
function insertImage(source, theme, base64,width, height){
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
    // No cursor or could not insert
  var body = DocumentApp.getActiveDocument().getBody();
    var paragraph = body.appendParagraph('')
    posImage   = paragraph.appendInlineImage(blob);
  }

  posImage.setAltDescription(source);
  posImage.setAltTitle('mermaid-graph/'+theme)
  posImage.setWidth(width/2)
  posImage.setHeight(height/2)
}