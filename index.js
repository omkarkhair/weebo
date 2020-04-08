const { Gpio } = require( 'onoff' );
var socket = require('socket.io-client')('http://localhost:3000');

// set BCM 4 pin as 'output'
const in1 = new Gpio('4', 'out')
const in2  = new Gpio( '17', 'out' );
const in3 = new Gpio('27', 'out');
const in4 = new Gpio('22', 'out')

// current LED state
let isLedOn = false;

function driveReset () {
    in1.writeSync(0);
    in2.writeSync(0);
    in3.writeSync(0);
    in4.writeSync(0);
}

function driveLeft () {
    in1.writeSync(1);
    in2.writeSync(0);
    in3.writeSync(0);
    in4.writeSync(1);
}

function driveRight () {
    in1.writeSync(0);
    in2.writeSync(1);
    in3.writeSync(1);
    in4.writeSync(0);
}

function driveForward () {
    in1.writeSync(1);
    in2.writeSync(0);
    in3.writeSync(1);
    in4.writeSync(0);
}

function driveBackward () {
    in1.writeSync(0);
    in2.writeSync(1);
    in3.writeSync(0);
    in4.writeSync(1);
}

driveReset();

socket.on('connect', function(){
    console.log("Connected to weebo server");
});

socket.on('weebo-control', function(data){
    console.log("Received instruction:", data);
    driveReset();
    switch (data) {
        case "l":
            console.log("going left")
            driveLeft();
            break;
        case "r":
            console.log("going right")
            driveRight();
            break;
        case "f":
            console.log("going forward");
            driveForward();
            break;
        case "b":
            console.log("going backward")
            driveBackward();
            break;
        default:
            console.log("stopping")
            driveReset();
            break;
    }
});

socket.on('disconnect', function(){
    console.log("Disconnected from weebo server");
});

/*
// run a infinite interval
setInterval( () => {
  in1.writeSync( isLedOn ? 0 : 1 ); // provide 1 or 0
  isLedOn = !isLedOn; // toggle state
  console.log("LED: ", isLedOn)
}, 3000 ); // 3s
*/