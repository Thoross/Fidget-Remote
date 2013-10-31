var io = require('socket.io').listen(9876);
var http = require('https');

io.sockets.on('connection', function(socket){
	socket.on('search', function(data){
		console.log(data.query);
		http.get(data.query,function(res){
			console.log("Got response: "+ res.statusCode);
			if(res.statusCode == 200){
				var bodyData = "";
				res.on("data", function(body){
					bodyData += body;	
				});	
				res.on("end", function(){
					socket.emit("search-result", JSON.parse(bodyData));
				});
			}	
		}).on('error',function(e){
			console.log('Got error: '+ e.message);
		});
	});
	
});