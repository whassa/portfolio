
var currentScore;
var frames = 0;
var gameElements = [];

var delay = 100;

var game = {
    canvas : document.createElement("canvas"),
    startButton : function() {
        this.clear();
        this.showMenu = false;
        gameElements = [];
        this.countDown();
    },
    start: function() {
        this.clear();
    },
    load : function() {
        this.canvas.width = 480;
        this.canvas.height = 280;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.canvas.addEventListener('click', canvaIsClicked, false);
  	},
    clear : function() {
        //clearInterval(this.interval)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    menu : function() {
        this.clear();
        this.showMenu = true;
        contentText(150, 40, "italic 30px Arial", "Project Target")
        menuButton(190, 70, 100, 50, () => { game.startButton() }, "start");
        menuButton(190, 130, 100, 50, () => { console.log('xd') }, "settings");
    },
    countDown : function( number ) {
        if (number === undefined){
            number = 3;
        } 
        if( number > 0 ){
            this.clear();
            contentText(235, 140, "bold 20px Arial", number);
            setTimeout( () => { game.countDown(number-1);},  1000)
        } else {
            this.clear();
            contentText(230, 140, "bold 20px Arial", 'go!');
            setTimeout( () => { game.start() },  1000);
        }
    },
}

function startGame(){
    game.load();
    game.menu();
}

function updateGameArea(){
    frames += 1;
    if ( frames > delay) {
        frames = 0;
    }
}

function contentText (x, y, font, text, name){
    var ctx = game.canvas.getContext("2d");
    ctx.font = font;
    ctx.fillText(text, x, y); 
}

function menuButton(x, y, width, height, callbackFct, message){
    var ctx = game.canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x,y,width,height);
    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(message, x+width/8, y+height/2+5)

    gameElements.push({ 
        x: x,
        y: y,
        width: width,
        height: height,
        callbackFct: callbackFct,
    })
}

function canvaIsClicked(event) {
    var x = event.pageX - 8,
        y = event.pageY - 8;

    gameElements.forEach(function(element) {
        if (y > element.y && y < element.y + element.height && x > element.x && x < element.x + element.width) {
            element.callbackFct();
        }
    });
}


function playGame(){
	
}