var express = require('express')
var app = express()
var PORT = 3000
var http = require('http').Server(app)
var io = require('socket.io')(http)
http.listen(PORT, () => console.log('listen on port' + PORT))


//express serve files
app.get('/', (req, res) => {res.sendFile(__dirname + '/index.html')})
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
app.use('/font', express.static('font'))

//game function parts
var clientNo = 0
var squareArr = [];
var lineArr = [];
var generateRandomType = function(){
	return Math.ceil(Math.random()*7);
}
var generateRandomDir = function(){
	return Math.ceil(Math.random()*4);
}
//socket connection

io.on('connection', (socket) => {
	clientNo++;
	if(clientNo === 1){
		console.log('1 user connected');
		io.emit('wait');
	}else if (clientNo === 2){
		console.log('2 users connected');
		
		io.emit('startbutton');


	}else {
		socket.emit('overload');
		console.log('too many players');
		socket.disconnect(true);
		clientNo--;
		return false;
	}
	socket.on('start', function(){
			var data = {};	
			console.log('pressstart');
			squareArr = [];
			lineArr = [];
			data.initType = generateRandomType();
			data.initDir = generateRandomDir();
			data.nextType = generateRandomType();
			data.nextDir = generateRandomDir();
			io.emit('clear');
			io.emit('start', data);
			io.emit('remote', data);
		});
	socket.on('disconnect', function(reason){
		clientNo--;
		console.log(reason);
		socket.broadcast.emit('lostcontact');
	})
	socket.on('reqSquare', function(squareNo){
		socket.emit('sendSquare', generateSquare(squareNo));
	})
	socket.on('right', function(){
		socket.broadcast.emit('right');
	})
	socket.on('left', function(){
		socket.broadcast.emit('left');
	})
	socket.on('down', function(){
		socket.broadcast.emit('down');
	})
	socket.on('fall', function(){
		socket.broadcast.emit('fall');
	})
	socket.on('rotate', function(){
		socket.broadcast.emit('rotate');
	})
	socket.on('performNext', function(data){
		socket.broadcast.emit('performNext', data);
	})
	socket.on('gameover', function(data){
		socket.broadcast.emit('gameover', data);
		socket.emit('gameover', true);
	})
	socket.on('fixed', function(){
		socket.broadcast.emit('fixed');
	})
	socket.on('checkClear', function(data){
		var group = generateRandomLines(data);
		socket.broadcast.emit('checkClear', group);  //for both remote and local
		socket.emit('addLine', group);
	})
	socket.on('checkGameOver', function(){
		socket.broadcast.emit('checkGameOver');
	})
})
//generate same squares for two sockets
var generateSquare = function(num){
	if(num > squareArr.length){
		var data = {};
		data.type = generateRandomType();
		data.dir = generateRandomDir();
		squareArr.push(data);
		return data;
	}
	else{
		return squareArr[num - 1];
	}
}
var generateRandomLines = function(data) {
	if(data.lines === 0){
		return false;
	}
	var group = [];
	for(var i=1; i<=data.lines; i++){
		if((data.no + i) <= lineArr.length){
			group.push(lineArr[data.no + i -1]);
		}
		else{
			var random;
			var bottom = [];
			for (var i=0; i<10; i++){   //   the width of game area is 10 grids
				random = Math.floor(Math.random()*2);
				bottom.push(random);
			}
			group.push(bottom);
			lineArr.push(bottom);
		}
	}
	return group;
}