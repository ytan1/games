var Square = function(typ, dir){
	//data of squares
	this.squares = new squareFac(typ);
	this.index = dir;
	this.data = this.squares.data[this.index-1];
	this.origin = {
		x: 0,
		y: 3
	};
}

Square.prototype.canDown = function(isValid){
	var test = {};
	test.x = this.origin.x + 1;
	test.y = this.origin.y;
	return isValid(test, this.data);
}
Square.prototype.down = function(){
	this.origin.x = this.origin.x + 1;
}
Square.prototype.canRight = function(isValid){
	var test = {};
	test.x = this.origin.x;
	test.y = this.origin.y + 1;
	return isValid(test, this.data);
}
Square.prototype.right = function(){
	this.origin.y = this.origin.y + 1;
}
Square.prototype.canLeft = function(isValid){
	var test = {};
	test.x = this.origin.x;
	test.y = this.origin.y - 1;
	return isValid(test, this.data);
}
Square.prototype.left = function(){
	this.origin.y = this.origin.y - 1;
}
Square.prototype.canRotate = function(isValid){
	var test = [];
	var testInd = this.index + 1;
	if(testInd % 4 === 1){
		testInd = 1;
	}
	test = this.squares.data[testInd-1];
	return isValid(this.origin, test);
}
Square.prototype.rotate = function(){
	this.index = this.index + 1;
	if(this.index % 4 === 1){
		this.index = 1;
	}
	this.data = this.squares.data[this.index-1];
}