const socket = io();

var interval;
socket.on('set-id', data => {
    let ind = data.ind;
    let state = data.state;

    board.setOwnIndex(ind);
    if (ind == 0) {
        $('.reset').removeClass('hide');
        if (state) {
            stateController.initState(state);
        } else {
            $('.setup-display').removeClass('hide');
        }
    } else {
        interval = setInterval(function() {
            socket.emit('request-setup', {});
        }, 200);
    }
});

socket.on('setup-state', data => {
    let state = data.state;
    stateController.initState(state);
    clearInterval(interval);
});

socket.on('update-state', data => {
    let state = data.state;
    stateController.applyState(state);
});

$('.control-button.undo').on('click', function(e) {
    socket.emit('undo-state', {});
});

$('.control-button.redo').on('click', function(e) {
    socket.emit('redo-state', {});
});