
  var colors = ["alert-success","alert-info","alert-danger"];
  var rand = Math.floor(Math.random()*colors.length);           
  var msgNbr = 1;
  var userNbr = 1;
  var userColor = colors[rand];
  
var socket = io.connect();  
	// on connection to server, ask for user's name with an anonymous callback
	socket.on('connect', function(){
			// call the server-side function 'adduser' and send one parameter (value of prompt)
			socket.emit('adduser', prompt("Please enter a Nickname"));
	});
	
	//add message to chat page
  $('form').submit(function(){
    socket.emit('newUpdateChat', $('#message').val());
    $('#message').val('');
    return false;
  });
  
	// listener, whenever the server emits 'chat message', this updates the chat body
	socket.on('updateChat', function (username, data) {
			$('#messages').append('<li class="msg'+msgNbr+username+'" ><b>'+ username + ':</b> ' + data + '</li>');
			if (username === 'SERVER'){
					$('.msg'+msgNbr+username+'').fadeIn("slow").addClass( " alert alert-warning" );
			}else{
					$('.msg'+msgNbr+username+'').fadeIn("slow").addClass( 'alert '+userColor+'' );
					console.log(userColor);
			}
			$(".server.alert.alert-warning").fadeOut("slow").display = "none";
			msgNbr++;
	});
	
		// listener, whenever the server emits 'serverlog', this updates the chat body
	socket.on('serverLog', function (data) {
			$('#messages').append('<li class="server alert alert-warning" style="display: none;" >' + data + '</li>');
			$(".server.alert.alert-warning").fadeIn("slow").display = "block";
	});

	// listener, whenever the server emits 'updateusers', this updates the username list
	socket.on('updateusers', function(data) {
			$('#usersnames').empty();
			$.each(data, function(key, value) {
					$('#usersnames').append('<li id ="username'+userNbr+'" class="list-group-item '+colors[rand]+'" >' + key + '</li>');
					console.log(colors[rand]);
					userNbr++;
			});
	});