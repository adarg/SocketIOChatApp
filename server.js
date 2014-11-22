// server.js
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var server = require('http').createServer(app).listen(port);
var io = require('socket.io').listen(server);

console.log('Express server listening on port ' + port);

app.use(express.static(__dirname + '/public'));  
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(morgan('dev')); // log every request to the console


// Nicknames currently connected to the chat
var usernames = {};
//var colors = {};

io.on('connection', function (socket) {
	console.log('A user is connected');
	
	// when the client emits 'adduser'
	socket.on('newUpdateChat', function(data){
		//call updateChat function
		io.sockets.emit('updateChat', socket.username, data);// toDo: add color for the message
		console.log('message: ' + data);
		
	});
	
	// when the client emits 'adduser'
	socket.on('adduser', function(username){
		// store the nickname in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('serverLog', 'You are connected to the Server');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updateChat', 'SERVER', username + ' is connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		console.log('user: '+ username +' was added to the list');
		});
		
		//if user disconnect display message
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('users list', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected');
		console.log('user has disconnected');
	});
		
});

//Tips: express route after sockets
app.get('/', function(req, res){
			res.sendFile(__dirname + '/index.html');
	 });
	 