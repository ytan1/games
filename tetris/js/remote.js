var Remote = function(socket){
	var game;
	var INTERVAL = 500;
	var times = 0;
	var timer = null;
	var gameover;
	//dom
	var bindevent = function(){
		socket.on('right', function(){
			game.right();
		})
		socket.on('left', function(){
			game.left();
		})
		socket.on('down', function(){
			game.down();
		})
		socket.on('fall', function(){
			game.fall();
		})
		socket.on('rotate', function(){
			game.rotate();
		})
		socket.on('performNext', function(data){
			game.performNext(data.type, data.dir);
		})
		socket.on('fixed', function(){
			game.fixed();
		})
		socket.on('checkClear', function(){
			game.checkClear();
		})
		socket.on('checkGameOver', function(data){
			game.checkGameOver();
		})
		socket.on('gameover', function(data){
			game.showResult(data);
			stop();
		})
		socket.on('addLine', function(group){
			game.addLine(group);
		})
		socket.on('lostcontact', () => {
			stop();
		})
	}
	var start = function(data){
		var doms = {
			gameDiv: document.getElementById('remote_game'),
			nextDiv: document.getElementById('remote_next'),
			timeDiv: document.getElementById('remote_time'),
			scoreDiv: document.getElementById('remote_score'),
			resultDiv: document.getElementById('remote_result')
		}
		game = new Game();
		game.init(doms, data.initType, data.initDir);
		game.performNext(data.nextType, data.nextDir);
		bindevent();
		timer = setInterval(timeFunc, INTERVAL);
	}
	var timeFunc = function(){
		times++;
		if(times % 2 === 0){
			game.setTime(times/2);
		}
	}
	var stop = function(){
		clearInterval(timer);
	}
	socket.on('clear', function(){
		document.getElementById('local_time').innerHTML = 0;
		document.getElementById('local_result').innerHTML = '';
		document.getElementById('local_score').innerHTML = 0;
	});
	this.start = start;
}