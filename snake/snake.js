var container = document.getElementById('container');
var food;
var snake = [];
var dir;
var timer = null;
var head;
var INTERVAL = 20;
var generator = function(){
	var f = document.createElement('div');
	f.style.top = Math.floor(Math.random()*100)*6 + 'px';
	f.style.left = Math.floor(Math.random()*100)*6 + 'px';
	f.className = 'food';
	return f;
}
var start =function(){
	var origin = {};
	origin.x = Math.floor(Math.random()*96)*6 + 12;
	origin.y = Math.floor(Math.random()*96)*6 + 12;
	var head = document.createElement('div');
	head.className = 'snake';
	head.style.top = origin.x + 'px';
	head.style.left = origin.y + 'px';
	container.appendChild(head);
	snake.push(head);
	food = generator();
	container.appendChild(food);
	dir = Math.ceil(Math.random()*4);
	bindEvent();
	timer = setInterval(move, INTERVAL);

}
var move = function(){
	var len = snake.length;
	var next = {};
	if(dir===1){  //left
		next.x = parseInt(snake[len-1].style.left) - 6;
		next.y = parseInt(snake[len-1].style.top);
	}else if (dir===2){  //down
		next.x = parseInt(snake[len-1].style.left);
		next.y = parseInt(snake[len-1].style.top) + 6;
	}else if (dir===3){
		next.x = parseInt(snake[len-1].style.left) + 6;
		next.y = parseInt(snake[len-1].style.top);
	}else if (dir===4){
		next.x = parseInt(snake[len-1].style.left);
		next.y = parseInt(snake[len-1].style.top) - 6;
	}
	check(next);
}
var check = function(next){
	if(next.x < 0||next.x >= 600||next.y < 0||next.y >= 600){
		stop();
	}
	else if (!checkSnake(next)){
		stop();
	}
	else if (next.x === parseInt(food.style.left) && next.y === parseInt(food.style.top)){
		food.className = 'snake';
		snake.push(food);
		var foodOrigin = {};
		foodOrigin.x = next.x;
		foodOrigin.y = next.y;
		while(!checkSnake(foodOrigin)){
			food = generator();
			foodOrigin.x = parseInt(food.style.left);
			foodOrigin.y = parseInt(food.style.top);
		}
		container.appendChild(food);
	}
	else{
		head = snake.shift();
		head.style.left = next.x + 'px';
		head.style.top = next.y + 'px';
		snake.push(head);
	}
}
var checkSnake = function(next){
	for(var i = 0; i < snake.length; i++){
		if(next.x === parseInt(snake[i].style.left) && next.y === parseInt(snake[i].style.top)){
			return false;
		}
	}
	return true;
}
var stop = function(){
	clearInterval(timer);
}
var bindEvent = function(){
	document.onkeydown = function(e){
		var keyNo = e.keyCode || e.which;
		if(keyNo === 37){
			if(dir !== 3){
				dir = 1;
				e.preventDefault();
			}
		}else if (keyNo === 38){
			if(dir !== 2){
				dir = 4;
				e.preventDefault();
			}
		}else if(keyNo === 39){
			if(dir !== 1){
				dir = 3;
				e.preventDefault();
			}
		}else if(keyNo === 40){
			if(dir !== 4){
				dir = 2;
				e.preventDefault();
			}
		}
	}
}
start();