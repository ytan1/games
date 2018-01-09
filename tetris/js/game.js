var Game = function(){
	//dom
	var gameDiv;
	var nextDiv;
	var timeDiv;
	var scoreDiv;
	var resultDiv;
	var score = 0;
	//martrix
	var gameData = [
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0]
	];
	//current
	var cur; 
	//next
	var next;
	var nextDivs = [];
	var gameDivs = [];
	var initDiv = function(container, data, divs) {
		for(var i=0; i<data.length; i++){
			var div = [];
			for(var j=0; j<data[0].length; j++) {
				var newNode = document.createElement('div');
				newNode.className = 'none';
				newNode.style.top = i*20 + 'px';
				newNode.style.left = j*20 + 'px';
				div.push(newNode);
				container.appendChild(newNode);
			}
			divs.push(div);
		}
	}
	var refreshDiv = function(data, divs) {
		for(var i=0; i<data.length; i++){
			for(var j=0; j<data[0].length; j++){
				if(data[i][j] === 0){
					divs[i][j].className = 'none';
				} else if(data[i][j] === 1){
					divs[i][j].className = 'done';
				} else if(data[i][j] === 2){
					divs[i][j].className = 'current';
				}
			}
		}
	}
	//push the square into the current position
	var setData = function(){
		for(var i=0; i<cur.data.length; i++){
			for(var j=0; j<cur.data[0].length; j++){
				if(check(cur.origin, i, j)){
					gameData[i + cur.origin.x][j + cur.origin.y] = cur.data[i][j];
				}
			}
		}
	}
	//check position of a grid is valid or not
	var check = function(pos, x, y) {
		if(pos.x + x >= gameData.length){
			return false;
		}
		else if(pos.y + y < 0){
			return false;
		}
		else if(pos.y + y >= gameData[0].length){
			return false;
		}
		else if(gameData[pos.x + x][pos.y + y] === 1){
			return false;
		}else {
			return true;
		}
	}
	//check position of square is valid or not
	var isValid = function(ori, data){
		for(var i=0; i<data.length; i++){
			for(var j=0; j<data[0].length; j++){
				if(data[i][j] !== 0){
					if(!check(ori, i, j)){
						return false;
					}
				}
			}
		}
		return true;
	}
	//clear
	var clear = function() {
		for(var i=0; i<cur.data.length; i++){
			for(var j=0; j<cur.data[0].length; j++){
				if(check(cur.origin, i, j)){
					gameData[i + cur.origin.x][j + cur.origin.y] = 0;
				}
			}
		}
	}
	//next square pushed into game
	var performNext = function(type, dir){
		cur = next;
		next = new Square(type, dir);
		setData();
		refreshDiv(gameData, gameDivs);
		refreshDiv(next.data, nextDivs);
	}
	//check if any line is full
	var checkClear = function(){
		var lines = 0;
		for(var i=gameData.length-1; i>=0; i--){
			var clear = true;
			for(var j=0; j<gameData[0].length; j++){
				if(gameData[i][j] !== 1){
					clear = false;
					break;
				}
			}
			if(clear){
				for(var j=i; j>0; j--){
					gameData[j] = gameData[j-1];
				}
				gameData[0] = [0,0,0,0,0,0,0,0,0,0];
				i++;
				lines++;
			}
		}
		addScore(lines);
		return lines;
	}
	//add score
	var addScore = function(lines){
		if(lines === 1){
			score = score + 10;
		}else if(lines === 2){
			score = score + 40;
		}else if(lines === 3){
			score = score + 90;
		}else if(lines === 4){
			score = score + 160;
		}
		scoreDiv.innerHTML = score;
	}
	var checkGameOver = function(){
		return (!isValid(next.origin, next.data));
	}
	//show result win or lose
	var showResult = function(result){
		if(result){
			resultDiv.innerHTML = 'You win';
		}
		else{
			resultDiv.innerHTML = 'You lose';
		}
	}
	//go down
	var down = function() {
		if(cur.canDown(isValid)){
			clear();
			cur.down();
			setData();
			refreshDiv(gameData, gameDivs);
			return true;
		}else{
			return false;
		}
	}
	var right = function() {
		if(cur.canRight(isValid)){
			clear();
			cur.right();
			setData();
			refreshDiv(gameData, gameDivs);
		}
	}
	var left = function() {
		if(cur.canLeft(isValid)){
			clear();
			cur.left();
			setData();
			refreshDiv(gameData, gameDivs);
		}
	}
	var rotate = function() {
		if(cur.canRotate(isValid)){
			clear();
			cur.rotate();
			setData();
			refreshDiv(gameData, gameDivs);
		}
	}
	//fix the square in bottom
	var fixed = function(){
		for(var i=0; i<cur.data.length; i++){
			for(var j=0; j<cur.data[0].length; j++){
				if(check(cur.origin, i, j)){
					if(gameData[cur.origin.x + i][cur.origin.y + j]===2){
						gameData[cur.origin.x + i][cur.origin.y + j] = 1;
					}
				}
			}
		}
		refreshDiv(gameData, gameDivs);
	}
	//set time
	var setTime = function(time){
		timeDiv.innerHTML = time;
	}
	//add additional random line at bottom
	var addLine = function(group){
		if(!group){
			return false;
		}
		for(var k=0; k < group.length; k++){
			for(var i=0; i<gameData.length-1; i++){
				for(var j=0; j<gameData[0].length; j++){
					if(gameData[i+1][j] !== 2){
						gameData[i][j] = gameData[i+1][j];
					}
				}
			}
			gameData[gameData.length-1] = group[k];
			if(cur.origin.x){
				cur.origin.x--;
			}
		}
	}
	//initialize
	var init = function(doms, type, dir){
		gameDiv = doms.gameDiv;
		nextDiv = doms.nextDiv;
		timeDiv = doms.timeDiv;
		scoreDiv = doms.scoreDiv;
		resultDiv = doms.resultDiv;
		next = new Square(type, dir);
		initDiv(gameDiv, gameData, gameDivs);
		initDiv(nextDiv, next.data, nextDivs);
	}
	//API
	this.init = init;
	this.down = down;
	this.right = right;
	this.left = left;
	this.rotate = rotate;
	this.fixed = fixed;
	this.fall = function(){
		while(down());
	}
	this.performNext = performNext;
	this.checkClear = checkClear;
	this.checkGameOver = checkGameOver;
	this.setTime = setTime;
	this.showResult = showResult;
	this.addLine = addLine;
}