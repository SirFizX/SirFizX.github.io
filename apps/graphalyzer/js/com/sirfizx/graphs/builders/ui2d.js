/*
*      Copyright (C) 2014
*      Author:  Eric Eisaman (SirFizX)
*
*        This software is provided as-is under GNU Version 3 License.
*        https://www.gnu.org/licenses/gpl.html
*        
*/

function UI2D(canvas){
        this.vertex_sprites = [];
        this.edge_sprites = [];
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.radius = 10;
        this.textcolor = 'blue';
        this.fontsize = 13;
        this.fontstyle = 'bold';
        this.fontfamily = 'Calibri';
        this.startcolor = 'green';
        this.finishcolor = 'red';
        
        this.vertexColor = 'grad'; // indicates to return a gradient fill when gradientFill() is called
        this.edgeColor = 'black';
    }
    
    
UI2D.prototype.drawVertexSprite= function(vs){

      this.context.beginPath();
      //this.context.moveTo(v2d.x,v2d.y);
      this.context.arc(vs.v2d.x, vs.v2d.y, vs.radius, 0, 2 * Math.PI, false);
      this.context.fillStyle = this.gradientFill(vs);
      this.context.fill();
      this.context.lineWidth = 1;
      this.context.strokeStyle = '#000000';
      this.context.stroke();
      
      

      this.context.fillStyle = this.textcolor;
      this.context.font = this.fontstyle+' ' + this.fontsize +'pt '+ this.fontfamily;
      this.context.fillText(vs.v2d.name, vs.v2d.x-1.5*this.radius, vs.v2d.y-1.5*this.radius);
      
}

UI2D.prototype.drawEdgeSprite = function(es){
    //console.log(es);
    //this.edge_sprites.push(es);
    
    console.log('drawing edge');

    this.context.beginPath();
    this.context.strokeStyle = es.color;
    this.context.moveTo(es.e2d.verts[0].v2d.x, es.e2d.verts[0].v2d.y);
    
    this.context.quadraticCurveTo(es.bend.x, es.bend.y,es.e2d.verts[1].v2d.x, es.e2d.verts[1].v2d.y);

    this.context.lineWidth = 1; // make depend on weight
    this.context.stroke();
    
    this.context.fillStyle = 'red';
    this.context.font = this.fontstyle + ' ' +this.fontsize+'pt '+ this.fontfamily;
    var p1 = es.e2d.verts[0].v2d; 
    var p2 = es.e2d.verts[1].v2d;
    var c = es.bend;
    var tx = (p1.x+p2.x)/4 + c.x/2;
    var ty = (p1.y+p2.y)/4 + c.y/2;
    //console.log('text position is tx: '+tx+' ty: '+ty);
    this.context.fillText(es.e2d.weight,tx,ty);
    
}

UI2D.prototype.gradientFill = function(vs){
    if(vs.color === "grad"){
        var blur_grad = this.context.createRadialGradient(vs.v2d.x, vs.v2d.y, 0, vs.v2d.x, vs.v2d.y, vs.radius);
        blur_grad.addColorStop(0, "rgba(0,120,1,0.5)");
        blur_grad.addColorStop(0.25, "rgba(0,120,1,0.5)");
        blur_grad.addColorStop(1, "rgba(0,120,1,0.0)");
        return blur_grad;
    } else return vs.color;
}

UI2D.prototype.clearGraph = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.vertex_sprites = [];
    this.edge_sprites = [];
}

UI2D.prototype.newFrame = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

UI2D.prototype.redrawGraph = function(){
    console.log('redraw');
    this.newFrame();
    var v = this.vertex_sprites;
    for(var i in v){
        console.log('drawing '+ v.length + ' vertices.');
        this.drawVertexSprite(v[i]);
    }
    var e = this.edge_sprites;
    for(var j in e){
        this.drawEdgeSprite(e[j]);
    }
}

function VertexSprite(v2d,radius,color){
    this.v2d = v2d;
    this.radius = radius;
    this.color = color;
}

function EdgeSprite(e2d,color){
    this.e2d = e2d;
    this.color = color;
    this.bend = new Vertex2D(new Vec2D((e2d.verts[0].v2d.x+e2d.verts[1].v2d.x)/2,(e2d.verts[0].v2d.y+e2d.verts[1].v2d.y)/2),'control_point');
}