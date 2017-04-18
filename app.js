var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');


app.listen(3000);

function handler(req, res) {
	fs.readFile(__dirname + '/index.html',
		function(err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		});
}

io.sockets.on('connection', function(socket) {
	// socket.emit('news', { hello: 'world' });
	// socket.on('my other event', function (data) {
	//   console.log(data);
	// });

	socket.set('nickname', 'nickname', function() {});

	socket.on('set nickname', function(name) {
		socket.set('nickname', name, function() {
			console.log("change nickname=>" + name);
			socket.emit('nickname ready');
		});
	});

	socket.on('chat', function(data) {
		socket.get('nickname', function(err, name) {

			socket.emit("notice", {
				message: name + ":" + data.message
			});
			socket.broadcast.emit("notice", {
				message: name + ":" + data.message
			});
			console.log("chat: " + data.message);
		});
	});
});

