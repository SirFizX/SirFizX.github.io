/*
*      Copyright (C) 2014
*      Author:  Eric Eisaman (SirFizX)
*
*        This software is provided as-is under GNU Version 3 License.
*        https://www.gnu.org/licenses/gpl.html
*        
*/
var container;
var canvas;
var graphs = [];
var current_graph;
var current_mode = 'Add Vertices';
var mode_element;
var usevisual_element;
var checkbox;
var btn_switchMode, btn_clr,btn_json,btn_png;
var btn_start, btn_finish;
var activeColor = 'pink';
var dropZone;


function switchMode(){
    
        current_graph.edgeVerts = []; // Ian suggested
        
        switch(current_mode){
            case 'Add Vertices':{
                current_mode = 'Add Edges';
                usevisual_element.style.visibility = 'visible';
            }
                break;
            case 'Add Edges':{
                usevisual_element.style.visibility = 'hidden';
                current_mode = 'Bend Edges';
            }
                break;
            case 'Bend Edges':{
                current_mode = 'Add Vertices';
            }
                break;
        }
        current_graph.editMode = current_mode;
        mode_element.innerHTML = current_mode;
    }
    
function handleFileSelect(evt) {
    
    console.log('handle file select');
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    
    var f = files[0];
    
    // files is a FileList of File objects. List some properties.  length 1 since we are not looping
    var output = [];
        
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');

    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        current_graph.clearGraph();
        return function (e) { 
            var vertices = e.target.result
            //alert(JSON.parse(vertices)[0].connections[0].weight);
            var c = JSON.parse(vertices);
            for(var i = 0;  i < c.length ; i++){
                current_graph.vertices.push(c[i]);
            }
            current_graph.drawLoadedGraph();
        };
    })(f);

    // Read in JSON as a data URL.
    reader.readAsText(f)
    

}

function handleDragOver(evt) {
    console.log('drag over');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
    

    
    
function exportJSON(){
    //window.open().location = JSON.stringify({x:'one'});
    
   //var uriContent = "data:application/octet-stream," + encodeURIComponent(current_mode);
   // var newWindow=window.open(uriContent, 'mode.txt');
   
   var v = current_graph.vertices
   
   var g= JSON.stringify(v);
   
   var a = document.createElement('a');
        var blob = new Blob([g], {'type':'data:application/octet-stream'});
        a.href = window.URL.createObjectURL(blob);
        a.download = 'graph.json';
        a.click();
   
   
}

function exportPNG(){

    window.open().location = canvas.toDataURL("image/png");
    
    var a = document.createElement('a');
    a.href = canvas.toDataURL("image/png")
    a.download = 'graph.png';
    a.click();
    
}

function setStart(){
    current_graph.settingStart = true;
    current_graph.settingFinish = false;
    btn_start.style.backgroundColor = activeColor;
}

function setFinish(){
    current_graph.settingFinish = true;
    current_graph.settingStart = false;
    btn_finish.style.backgroundColor = activeColor;
}


function loadGraph(){
    
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      alert('yeah!');
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
     
}


function init(){
    
    
    canvas = document.getElementById("graphCanvas");
    context =
    
    mode_element = document.getElementById('modename');
    
    
    btn_switch_mode = document.getElementById("btn_mode"); 
    btn_switch_mode.addEventListener('click',switchMode);
    
    btn_clr = document.getElementById("btn_clear"); 
    btn_clr.addEventListener('click',function(){current_graph.clearGraph()});
    
    
    btn_json = document.getElementById("btn_json"); 
    btn_json.addEventListener('click',exportJSON);
    
    btn_png = document.getElementById("btn_png"); 
    btn_png.addEventListener('click',exportPNG);
    
    usevisual_element = document.getElementById('usevisual');
    checkbox = document.getElementById('checkbox');
    
    
    
    current_graph = new Graph('2d',canvas);
    current_mode = 'Add Vertices';
    current_graph.editMode = current_mode;
    
    canvas.addEventListener('mousedown',function(e){current_graph.onMouseDown(e)},false);
    
    btn_start = document.getElementById("btn_start"); 
    btn_start.addEventListener('click',setStart);
    btn_start.disabled = true;
    
    btn_finish = document.getElementById("btn_finish"); 
    btn_finish.addEventListener('click',setFinish);
    btn_finish.disabled = true;
    
    dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    

    
}

init();


