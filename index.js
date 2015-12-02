var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)
var RunMessage = true;
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    if (RunMessage) {
      ws.send(JSON.stringify(new Date()), function() {  });
    }
  }, 1000)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    switch(message) {
      case "start": RunMessage = true; 
                    break;
      case "stop":  RunMessage = false; 
                    break;
    }
});

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
