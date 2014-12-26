/*
*      Copyright (C) 2014
*      Author:  Eric Eisaman (SirFizX)
*
*        This software is provided as-is under GNU Version 3 License.
*        https://www.gnu.org/licenses/gpl.html
*        
*/

function Vec2D(x,y){
        this.x =x;
        this.y =y;
    }
Vec2D.prototype.distSqrd = function(v2d){
    return (this.x-v2d.x)*(this.x-v2d.x)+(this.y-v2d.y)*(this.y-v2d.y);
}



function Vertex2D(position,name){
    this.name = name;
    this.x = position.x;
    this.y = position.y;
    this.connections = [];// this creates a circular reference, instead use connections[names]
}


