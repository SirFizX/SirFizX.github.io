/*
*      Copyright (C) 2014
*      Author:  Eric Eisaman (SirFizX)
*
*        This software is provided as-is under GNU Version 3 License.
*        https://www.gnu.org/licenses/gpl.html
*        
*/

function Graph(dimension,canvas){
    switch(dimension){
        case '2d': this.ui = new UI2D(canvas);
        break;
        case '3d': this.ui = new UI3D(canvas); //to be done
        break;
    }
    this.editMode;
    this.edgeVerts = [];
    this.canvas = canvas;
    this.vertices = [];
    this.edges = [];
    this.chosenEdge;
    this.letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
    this.current_letter_index = 0;
    this.dimension = dimension;
    this.bending = false;
    this.settingStart = false;
    this.settingFinish = false;
    this.startVertex;
    this.finishVertex;
    }
    

Graph.prototype.createVertex2D = function(e){
    //alert(e.clientX);
    //console.log(this);
    var x = e.clientX;
    var y = e.clientY;
    var rect = this.canvas.getBoundingClientRect();
    var v2d = new Vec2D(x-rect.left,y-rect.top);
    if(!this.tooClose(v2d,this.ui.radius*10)){
        var v = new Vertex2D(v2d,this.letters[this.current_letter_index]);
        this.current_letter_index++;
        this.vertices.push(v);
        var vs = new VertexSprite(v,this.ui.radius,this.ui.vertexColor);
        this.ui.vertex_sprites.push(vs);
        this.ui.drawVertexSprite(vs);
        if(this.vertices.length>1 && btn_start.disabled){
            btn_start.disabled = false;
            btn_finish.disabled = false;
        }
    }
    
    
}
Graph.prototype.tooClose = function(v2d,amt){
    var rt = false;
    var v = this.vertices;
    for (var i in v) {
        if(v2d.distSqrd(v[i])<amt*amt){
            rt = true;
        }
    }
    return rt;
}
Graph.prototype.addEdge = function(e){
    var vs = this.vertexClicked(e);
    console.log(vs);
    var v = this.edgeVerts;
    if(vs){
        if(v.length===0 || vs.v2d.name!==v[v.length-1].v2d.name) this.setEdgeVertex(vs);
    }
}

Graph.prototype.vertexClicked = function(e){
    
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX-rect.left;
    var y = e.clientY-rect.top;
    var v = this.edgeVerts;
    var s = this.ui.vertex_sprites;
    for (var i in s) {
        var vs = s[i];
        var rs = vs.radius*vs.radius;
        var ds = (x-vs.v2d.x)*(x-vs.v2d.x)+(y-vs.v2d.y)*(y-vs.v2d.y);
        if(ds<rs){
            return vs;
        }
    }
}



Graph.prototype.setEdgeVertex = function(vs,weightFromLoadedGraph){
    
    this.edgeVerts.push(vs);
    
    console.log('setting edge vertex');
    
    if(this.edgeVerts.length==2 && !this.edgeExists(weightFromLoadedGraph)){ 
        var e2d = new Edge2D(this.edgeVerts);
        var es = new EdgeSprite(e2d,this.ui.edgeColor);
        
        var w;
        var v1 = this.edgeVerts[0].v2d;
        var v2 = this.edgeVerts[1].v2d;
        
        if(!weightFromLoadedGraph){
        
            if(checkbox.checked){  // outside reference should change
                e2d.weight = this.dist(v1,v2);
                 w = e2d.weight;
            } else w = e2d.setWeight();
            
            if (isNaN(w)){
                 e2d.weight = this.dist(v1,v2);
                 w = e2d.weight;
            }
        
        } else {
            e2d.weight = weightFromLoadedGraph;
        }
        
        this.edges.push(e2d);
        
        var n1 = v1.name;
        var n2 = v2.name
        v1.connections.push({ name : n2 , weight : w });
        v2.connections.push({ name: n1 , weight : w });
        //console.log(this.edgeVerts);
        this.edgeVerts = [];
        this.ui.edge_sprites.push(es);
        this.ui.drawEdgeSprite(es);
    }
    
}

Graph.prototype.edgeExists = function(b){
    var esa = this.edges;
    var v = this.edgeVerts;
    var nm1 = this.edgeVerts[0].v2d.name;
    var nm2 = this.edgeVerts[1].v2d.name;
    var match = false;
    for(var i in esa){
        var es = esa[i];
        var n1 = es.verts[0].v2d.name;
        var n2 = es.verts[1].v2d.name;
        console.log(nm1 + ' '+nm2+' '+n1+' '+n2);
        if ( (nm1===n1||nm1===n2) && (nm2===n1||nm2===n2) ){
             match = true;
             //alert('Only 1 edge allowed between any 2 vertices.');
             this.edgeVerts = [];
        }
    }
    return match;
}

Graph.prototype.dist = function(v1,v2){
    return parseInt(Math.sqrt((v2.x-v1.x)*(v2.x-v1.x)+(v2.y-v1.y)*(v2.y-v1.y)));
}

Graph.prototype.checkEdgeClicked = function(e){
    console.log('checking if edge was clicked');
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX-rect.left;
    var y = e.clientY-rect.top;
    var es = this.ui.edge_sprites;
    console.log(es);
    var found = false;
    for (var i in es) {
        var v = es[i].e2d.verts;
        var p1 = v[0].v2d;
        var p2 = v[1].v2d;
        ds = dotLineLength(x,y,p1.x,p1.y,p2.x,p2.y,true);
        //console.log(p1);
        if(ds<15 && !found){
            this.chosenEdge = es[i];
            found=true;
        }
      
    }
    if(found){
        
        this.canvas.addEventListener('mouseup',this.bendEdge.bind(this));
        console.log('start bending');
        this.bending = true;
    }
}



Graph.prototype.checkEdgeClicked.bind(this);

Graph.prototype.bendEdgeClicked = function(e){
    var es = this.checkWeightClicked(e);
    console.log(es);
    if(es){
        this.chosenEdge = es;
        this.canvas.addEventListener('mouseup',this.bendEdge.bind(this));
        console.log('start bending');
        this.bending = true;
    }
}

Graph.prototype.checkWeightClicked = function(e){
    console.log('checking if weight clicked');
    console.log(e);
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX-rect.left;
    var y = e.clientY-rect.top;
    var s = this.ui.edge_sprites;
    for (var i in s) {
        var p1 = s[i].e2d.verts[0].v2d; 
        var p2 = s[i].e2d.verts[1].v2d;
        var c = s[i].bend;
        var tx = (p1.x+p2.x)/4 + c.x/2;
        var ty = (p1.y+p2.y)/4 + c.y/2;
        var rs = 400;
        var ds = (x-tx)*(x-tx)+(y-ty)*(y-ty);
        console.log(ds);
        if(ds<rs){
            return s[i];// return edge sprite
        }
    }
}


Graph.prototype.bendEdge = function(e){
    if(this.bending){
        console.log('bending.. the event is '+e);
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX-rect.left;
        var y = e.clientY-rect.top;
        var p1 = this.chosenEdge.e2d.verts[0].v2d; 
        var p2 = this.chosenEdge.e2d.verts[1].v2d;
        this.chosenEdge.bend.x = x;
        this.chosenEdge.bend.y = y;
        this.ui.redrawGraph();
        this.canvas.removeEventListener('mouseup',this.bendEdge.bind(this));
        this.bending = false;
    }
    
    
}


Graph.prototype.clearGraph = function(){
    this.vertices = [];
    this.edges = [];
    this.edgeVerts =[];
    this.current_letter_index = 0;
    this.ui.clearGraph();
}

Graph.prototype.setStart = function(e){
    var vs = this.vertexClicked(e);
    if(vs){
        vs.color = 'green';
        if(this.startVertex)this.startVertex.color = 'grad';  // there may only be one start
        this.startVertex = vs;
        btn_start.style.backgroundColor = 'white';
        this.settingStart = false;
        console.log(this.ui.vertex_sprites);
        this.ui.redrawGraph();
    }
    
}

Graph.prototype.setFinish = function(e){
    var vs = this.vertexClicked(e);
    if(vs){
        vs.color = 'red';
        if(this.finishVertex)this.finishVertex.color = 'grad'; // there may only be one finish
        this.finishVertex = vs;
        btn_finish.style.backgroundColor = 'white';
        this.settingFinish = false;
        this.ui.redrawGraph();
    }
    
}

Graph.prototype.drawLoadedGraph = function(){
    //alert(this.vertices[0].connections[3].name);
    var c = this.vertices;
    this.current_letter_index = c.length; // so we can add vertices after load
    var s = this.ui.vertex_sprites;
    for(var i = 0; i<c.length;i++){
        var v2d = new Vertex2D(new Vec2D(c[i].x,c[i].y),c[i].name);
        var e = c[i].connections;
        for(var j = 0;j<e.length;j++){
            v2d.connections.push(e[j]);
        }
        var vs = new VertexSprite(v2d,this.ui.radius,'grad');
        s.push(vs);
    }
    
    for(var k = 0;k<s.length;k++){
        
        if(s[k].v2d.connections){  //s[k] is the vertex sprite  
            var d = s[k].v2d.connections;
            for(var n = 0;n<d.length;n++){
                this.setEdgeVertex(s[k]);
                var w = this.findVSByName(d[n].name);
                if(w)this.setEdgeVertex(w,d[n].weight);
                else alert('can not find vs by name');
            }
        }
    }
    
    this.ui.redrawGraph();
    
}

Graph.prototype.findVSByName = function(name){
    
    var vs = this.ui.vertex_sprites;
    var l = vs.length;
    for(i = 0;i<l;i++){
        if(vs[i].v2d.name == name)return vs[i];
    }
    
}



Graph.prototype.onMouseDown = function(e){
    
    if(this.settingStart || this.settingFinish){
        
        if(this.settingStart) this.setStart(e);
        else this.setFinish(e);
        return;
    }
    
    switch(this.editMode){
        case 'Add Vertices': {
            if(this.dimension=='2d')this.createVertex2D(e);
            else this.createVertex3D(e);
        }
            break;
        case 'Add Edges':{
            this.addEdge(e);
            console.log('start add edge commands');
            
        }
            break;
        case 'Bend Edges':{
            this.bendEdgeClicked(e);
        }
            break;
        
    }
    
}

Graph.prototype.onMouseDown.bind(this);

Graph.prototype.init = function(){
    //this.canvas.addEventListener('click',function(e){console.log(this)},true);
}

