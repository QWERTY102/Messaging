var socket = io.connect("http://localhost:4000");
canvas = document.getElementById("canvas")
c = canvas.getContext("2d")
c.translate(0.5, 0.5);
const size = 20
const friction = 0.9
var player = {x:10,y:10}
var velocityX = 0
var velocityY = 0
var keys = {right:false,left:false,up:false}
var jumping = false
var players = [];
var newPlayer = false

canvas.addEventListener("mousemove",function(info){
})

update()

function update() {
    window.requestAnimationFrame(update)
    c.clearRect(0,0,720,405)
    c.fillStyle = "#000000"
    c.fillRect(0,355,720,405)    
    c.fillRect(player.x,player.y,size,size)
    drawPlayers()
    collision()
    movement();
    velocityY += 1.5
    player.x += velocityX
    player.y += velocityY
    velocityX *= 0.9
    velocityY *= 0.9
    sendData()
}

document.onkeydown = function(event) {
    console.log(event.keyCode)
    if (event.keyCode == 87 || event.keyCode == 32) {
        keys.up = true;
    } if (event.keyCode == 68) {
        keys.right = true;
    } else if (event.keyCode == 65) {
        keys.left = true;
    }
}

document.onkeyup = function(event) {
    if (event.keyCode == 87 || event.keyCode == 32) {
        keys.up = false;
    } 
    if (event.keyCode == 68) {
        keys.right = false;
    } else if (event.keyCode == 65) {
        keys.left = false;
    }
}

function movement() {
    if (keys.up && !jumping) {
        velocityY -= 35;
        jumping = true;
    } if (keys.right) {
        velocityX += 0.8
    } else if (keys.left) {
        velocityX -= 0.8
    }
}

function shooting() {
    if (mouse) {}
}

function collision() {
    if (player.y > 355-size) {
        velocityY = 0
        jumping = false
        player.y = 355-size
    }
}

function sendData() {
socket.emit("Coord", {
    x: player.x,
    y: player.y
})
}

function drawPlayers() {
    for (i = 0;i< players.length;i++) {
        c.fillStyle = '#ff0000'
        c.fillRect(players[i].x,players[i].y,size,size)
    }
}

socket.on("Coord", function(data) {
    newPlayer = true
    for (var i = 0; i < players.length;i++) {
        if (data.socket == players[i].socket) {
            newPlayer = false
            index = i
            break;
        }
    }
    if (newPlayer) {
        players.push(data)
    } else {
        players[index].x = data.x
        players[index].y = data.y
    }
    
})        