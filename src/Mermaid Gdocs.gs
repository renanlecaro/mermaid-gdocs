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
    DocumentApp.getUi().alert('Please select an existing chart created with this app first. Make sure the graph image placement is "in line" or it will not work.');
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

    openDialog(source, 'Update', theme, selected.getWidth())
  }
}

function openDialog(source,label,theme, currentWidth=0) {

  var html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(3000)
    .setHeight(2000)
    .append(`<script>
      window.graphDataFromGoogle=${JSON.stringify({source,label,theme, currentWidth})}
    </script>`) ;


  DocumentApp.getUi()
      .showModalDialog(html, 'Graph editor')
}


function findSelectedImage(){

  try{
    return DocumentApp.getActiveDocument().getSelection()
      ?.getRangeElements()
      ?.map(rangeElement=>rangeElement.getElement())
      .find(element=>element.getType()==DocumentApp.ElementType.INLINE_IMAGE &&  element.asInlineImage().getAltTitle()?.startsWith('mermaid-graph'))
      ?.asInlineImage()
  }catch(e){
    DocumentApp.getUi().alert('It looks like you are trying to use this addon with multiple google accounts'+
    ' logged in. Only the "default" account (the one shown when you open google) will work here,'+
    ' because of a limitation of google docs. You can either open this page in a private navigation, or change'+
    ' the default account. To change the default account, log out of all accounts, then log in with the desired'+
    ' default account first. Sorry for the inconvenience, it is an issue out of our control. ');
  }

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

    posImage.setWidth(width)
    posImage.setHeight(height)

}