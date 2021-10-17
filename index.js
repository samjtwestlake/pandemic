
const express = require('express');
const socket = require("socket.io");

const PORT = process.env.PORT || 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

const root = __dirname + '/public/html/';

app.use(express.static("public"));

app.get('/', function(req, resp) {
    resp.sendFile(root + 'index.html');
});
app.get('/host', function(req, resp) {
    resp.sendFile(root + 'index.html');
});
app.get('/player2', function(req, resp) {
    resp.sendFile(root + 'index.html');
});
app.get('/player3', function(req, resp) {
    resp.sendFile(root + 'index.html');
});
app.get('/player4', function(req, resp) {
    resp.sendFile(root + 'index.html');
});
app.get('/player5', function(req, resp) {
    resp.sendFile(root + 'index.html');
});
app.get('/player6', function(req, resp) {
    resp.sendFile(root + 'index.html');
});

const io = socket(server);

const N = 20;
var states = [];
var redoStates = [];
var state = null;
var clients = [];
io.on("connection", function (socket) {
    console.log("Made socket connection");
    clients[socket.id] = socket;

    let referer = socket.request.headers.referer;
    let identifier = referer.substr(referer.lastIndexOf("/") + 1);

    let ind = null;
    if (identifier == "host") {
        ind = 0;
    } else {
        let head = identifier.slice(0,identifier.length - 1);
        if (head == "player"){
            ind = parseInt(identifier[identifier.length - 1], 10) - 1;
        }
    }

    if (ind !== null) {
        socket.emit('set-id', { ind: ind, state: state });
    }

    socket.on('request-setup', data => {
        if (state) {
            socket.emit('setup-state', { state: state });
        }
    });

    socket.on('broadcast-setup', data => {
        state = data.state;
        states = [state];
        redoStates = [];
    });

    socket.on('broadcast-state', data => {
        redoStates = [];
        state = data.state;
        states.unshift(state);
        if (states.length > N) {
            states.pop();
        }

        for (let otherSocket of Object.values(clients)) {
            // if (otherSocket.id != socket.id) {
                otherSocket.emit('update-state', data);
            // }
        }
    });

    socket.on('undo-state', x => {
        if (states.length > 1) {
            redoStates.unshift(state);
            states.shift();
            state = states[0];
            let data = {
                state: state,
            };

            for (let socket of Object.values(clients)) {
                socket.emit('update-state', data);
            }
        }
    });

    socket.on('redo-state', x => {
        if (redoStates.length) {
            state = redoStates.shift();
            states.unshift(state);
            let data = {
                state: state,
            };
    
            for (let socket of Object.values(clients)) {
                socket.emit('update-state', data);
            }
        }
    });

    socket.on('nullify-state', data => {
        state = null;
    });

    socket.on('disconnect', function() {
        delete clients[socket.id];
    });
});

