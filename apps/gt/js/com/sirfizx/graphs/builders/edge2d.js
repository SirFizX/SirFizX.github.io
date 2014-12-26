function Edge2D(verts){
	this.verts = verts;
	this.weight;
}

Edge2D.prototype.setWeight = function(){
	this.weight = parseInt(prompt('Edge Weight: ','Use visual distance.'));
	return this.weight;
}