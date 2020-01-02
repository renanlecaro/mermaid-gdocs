function onInstall(e) {
  onOpen(e); 
}

function onOpen() {
  DocumentApp.getUi() 
      .createAddonMenu() 
      .addItem('Edit selected', 'edit')
      .addItem('New Flowchart', 'newFlowchart')
      .addItem('New Sequence', 'newSequence')
      .addItem('New Gantt', 'newGantt')
      .addItem('New Class Diagram', 'newClassDiagram')
      .addToUi();
}

function edit(){
  var selected=findSelectedImage()
  if(!selected){
    DocumentApp.getUi().alert('Please select an existing chart created with this app first.');
  }else{
    openDialog(selected.getAltDescription(), 'Update')
  }
}

function newFlowchart(){
  var selected=findSelectedImage()
  if(selected){
    DocumentApp.getUi().alert('You have a chart selected, please unselect it first, or click "edit" to edit it.');
  }else{
    openDialog("\ngraph LR\n    A[Hard edge] -->|Link text| B(Round edge)\n    B --> C{Decision}\n    C -->|One| D[Result one]\n    C -->|Two| E[Result two]\n",
    'Insert')
  }
}

function newSequence(){
  var selected=findSelectedImage()
  if(selected){
    DocumentApp.getUi().alert('You have a chart selected, please unselect it first, or click "edit" to edit it.');
  }else{
    openDialog("sequenceDiagram\n    Alice->>Bob: Hello Bob, how are you?\n    alt is sick\n        Bob->>Alice: Not so good :(\n    else is well\n        Bob->>Alice: Feeling fresh like a daisy\n    end\n    opt Extra response\n        Bob->>Alice: Thanks for asking\n    end\n",
    'Insert')
  }
}

function newGantt(){
  var selected=findSelectedImage()
  if(selected){
    DocumentApp.getUi().alert('You have a chart selected, please unselect it first, or click "edit" to edit it.');
  }else{
    openDialog("gantt\n   dateFormat  YYYY-MM-DD\n   title Adding GANTT diagram functionality to mermaid\n\n   section A section\n   Completed task            :done,    des1, 2014-01-06,2014-01-08\n   Active task               :active,  des2, 2014-01-09, 3d\n   Future task               :         des3, after des2, 5d\n   Future task2              :         des4, after des3, 5d\n\n   section Critical tasks\n   Completed task in the critical line :crit, done, 2014-01-06,24h\n   Implement parser and jison          :crit, done, after des1, 2d\n   Create tests for parser             :crit, active, 3d\n   Future task in critical line        :crit, 5d\n   Create tests for renderer           :2d\n   Add to mermaid                      :1d\n\n   section Documentation\n   Describe gantt syntax               :active, a1, after des1, 3d\n   Add gantt diagram to demo page      :after a1  , 20h\n   Add another diagram to demo page    :doc1, after a1  , 48h\n\n   section Last section\n   Describe gantt syntax               :after doc1, 3d\n   Add gantt diagram to  page      :20h\n   Add another diagram to demo page    :48h\n",
    'Insert')
  }
}

function newClassDiagram(){
  var selected=findSelectedImage()
  if(selected){
    DocumentApp.getUi().alert('You have a chart selected, please unselect it first, or click "edit" to edit it.');
  }else{
    openDialog("classDiagram\nClass01 <|-- AveryLongClass : Cool\nClass03 *-- Class04\nClass05 o-- Class06\nClass07 .. Class08\nClass09 --> C2 : Where am i?\nClass09 --* C3\nClass09 --|> Class07\nClass07 : equals()\nClass07 : Object[] elementData\nClass01 : size()\nClass01 : int chimp\nClass01 : int gorilla\nClass08 <--> C2: Cool label",
    'Insert')
  }
}

function openDialog(source,label) { 
 
  var html = HtmlService.createHtmlOutputFromFile('index')
      .append('<script>window.setup('+JSON.stringify(source)+', '+JSON.stringify(label)+')</script>')
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
 
function insertImage(source, base64,width, height){
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
  posImage.setAltTitle('mermaid-graph')
  posImage.setWidth(width/2)
  posImage.setHeight(height/2)
}