var Local = function(socket){
	var game;
	var INTERVAL = 500;
	var timer = null;
	var times = 0;
	var squareNo = 0;
	var addLineNo = 0;
	var addLineData = {};
	var gameover;
	var lines;
	//binding events
	var bindKeyEvent = function(){
		document.onkeydown = function(e){
			if(e.keyCode === 38){
				game.rotate();
				socket.emit('rotate');
			}else if(e.keyCode === 37){
				game.left();
				socket.emit('left');
			}else if(e.keyCode === 39){
				game.right();
				socket.emit('right');
			}else if(e.keyCode === 40){
				game.down();
				socket.emit('down');
			}else if(e.keyCode === 32){
				game.fall();
				socket.emit('fall');
			}
		}
		var keydown = function(e) {
			var ele = e.target || e.srcElement;
			var k = parseInt(ele.getAttribute('keyvalue'));
		    var oEvent = document.createEvent('KeyboardEvent');

		    // Chromium Hack
		    Object.defineProperty(oEvent, 'keyCode', {
		                get : function() {
		                    return this.keyCodeVal;
		                }
		    });     
		    Object.defineProperty(oEvent, 'which', {
		                get : function() {
		                    return this.keyCodeVal;
		                }
		    });     

		    if (oEvent.initKeyboardEvent) {
		        oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
		    } else {
		        oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
		    }

		    oEvent.keyCodeVal = k;

		    if (oEvent.keyCode !== k) {
		        alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
		    }

		    document.dispatchEvent(oEvent);
		}
		document.getElementsByClassName('space')[0].onclick = keydown;
		document.getElementsByClassName('left')[0].onclick = keydown;
		document.getElementsByClassName('right')[0].onclick = keydown;
		document.getElementsByClassName('up')[0].onclick = keydown;
		document.getElementsByClassName('space')[0].onclick = keydown;
	}
	var move = function(){
		timeFunc();
		if(!game.down()){
			game.fixed();
			socket.emit('fixed');
			lines = game.checkClear();
			//get same random lines from the server
			if(lines){lines--;}
			addLineData.no = addLineNo;
			addLineData.lines = lines;
			socket.emit('checkClear', addLineData);
			addLineNo += lines;
			//check if the game is over
			gameOver = game.checkGameOver();
			socket.emit('checkGameOver');
			if(gameOver){
				game.showResult(!gameOver);
				socket.emit('gameover', false);
				var html = '<button onclick="local.pressstart()">start a new game</button>';
				document.getElementById('wait').innerHTML = html;
				socket.emit('reqSquare', squareNo);
				stop();
			}
			else{
				squareNo++;
				socket.emit('reqSquare', squareNo);
			}
		}else{
			socket.emit('down');
		}
	}
	var timeFunc = function(){
		times++;
		if(times % 2 === 0){
			game.setTime(times/2);
		}
		//if(times % 400 === 0){
		//	game.addLine();
		//}
	}
	var start = function(data){
		document.getElementById('wait').innerHTML = 'playing.. ';
		var doms = {
			gameDiv: document.getElementById('local_game'),
			nextDiv: document.getElementById('local_next'),
			timeDiv: document.getElementById('local_time'),
			scoreDiv: document.getElementById('local_score'),
			resultDiv: document.getElementById('local_result')
		}
		game = new Game();
		squareNo = 0;
		addLineNo = 0;
		game.init(doms, data.initType, data.initDir);
		game.performNext(data.nextType, data.nextDir);
		bindKeyEvent();
		timer = setInterval(move, INTERVAL);
		socket.on('sendSquare', function(data){
			game.performNext(data.type, data.dir);
			socket.emit('performNext', data);
		})
		socket.on('gameover', function(data){
			if(!data){
				game.showResult(true);
				var html = '<button onclick="local.pressstart()">start a new game</button>';
				document.getElementById('wait').innerHTML = html;
				stop();
			}
		})
		socket.on('checkClear', function(group){
			game.addLine(group);
		})
		socket.on('lostcontact', function() {
			stop();
			document.getElementById('wait').innerHTML = 'lost connect with the other, game stop';
		})
	}
	socket.on('wait', function(){
		document.getElementById('wait').innerHTML = '..Waiting for another player...';
	})
	socket.on('startbutton', function(){
		var html = '<button onclick="local.pressstart()">start a new game</button>';
		document.getElementById('wait').innerHTML = html;
	})
	var pressstart = function(){
		socket.emit('start');
	}
	socket.on('clear', function(){
		document.getElementById('local_time').innerHTML = 0;
		document.getElementById('local_result').innerHTML = '';
		document.getElementById('local_score').innerHTML = 0;
	});

	var stop = function(){
		clearInterval(timer);
		document.onkeydown = null;
	}
	this.start = start;
	this.pressstart = pressstart;
}