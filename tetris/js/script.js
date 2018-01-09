var socket = new io();
var local = new Local(socket);
var remote = new Remote(socket);
socket.on('start', function(data) {
	local.start(data);
})
socket.on('remote', function(data){
	remote.start(data);
})
socket.on('overload', () => {
	alert('Too many players (〒︿〒)');
})
//prevent spacebar from scrolling down
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

(function() {
    var lastTouch = 0;
    function preventZoom(e) {
        var t2 = e.timeStamp;
        var t1 = lastTouch || t2;
        var dt = t2 - t1;
        var fingers = e.touches.length;
        lastTouch = t2;

        if (!dt || dt >= 300 || fingers > 1) {
            return;
        }
        resetPreventZoom();
        e.preventDefault();
        e.target.click();
    }
    function resetPreventZoom() {
        lastTouch = 0;
    }

    document.addEventListener('touchstart', preventZoom, false);
    document.addEventListener('touchmove', resetPreventZoom, false);
})();