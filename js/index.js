
var frames = 0;
var gameElements = [];
var delay = 50;

var squareSize = 50;

var game = {
    score: 0,
    canvas : document.createElement("canvas"),
    startButton : function() {
        this.clear();
        this.showMenu = false;
        gameElements = [];
        this.countDown();
    },
    start: function() {
        this.clear();
        renderGameItems();
        setInterval(function(){ updateGameArea();}, 20);
        
    },
    load : function() {
        this.canvas.width = 1000;
        this.canvas.height = 800;
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
        contentText(this.canvas.width/2-100, 300, "italic 30px Arial", "Project Target")
        menuButton(this.canvas.width/2-50, 350, 100, 50, () => { game.startButton() }, "start");
        menuButton(this.canvas.width/2-50, 420, 100, 50, () => { console.log('xd') }, "settings");
    },
    countDown : function( number ) {
        if (number === undefined){
            number = 3;
        } 
        if( number > 0 ){
            this.clear();
            showScore();
            contentText(this.canvas.width/2, this.canvas.height/2, "bold 20px Arial", number);
            setTimeout( () => { game.countDown(number-1);},  1000)
        } else {
            this.clear();
            showScore();
            contentText(this.canvas.width/2, this.canvas.height/2, "bold 20px Arial", 'go!');
            setTimeout( () => { game.start() },  1000);
        }
    },
    
}

function startGame(){
    game.load();
    game.menu();
}


function updateGameArea (){
    frames += 1;
    if ( frames > delay) {
        renderGameItems();
        frames = 0;
    }
}

function renderGameItems(){
    game.clear();
    showScore();
    generateRandomSquare();
}


function showScore(){
    contentText(game.canvas.width-120, 20, "bold 20px Arial", "Score : "+ game.score);
}

function generateRandomSquare(){
    gameElements = [];

    let randomX = rando(game.canvas.width-squareSize);
    let randomY = rando(20, game.canvas.height-squareSize);

    var ctx = game.canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(randomX,randomY,squareSize,squareSize);

    gameElements.push({ 
        x: randomX,
        y: randomY,
        width: squareSize,
        height: squareSize,
        callbackFct: squareIsClicked,
    });
}

function squareIsClicked(element){
    if( !element.isClick){
        element.isClick = true;
        game.clear();
        showScore();
        var ctx = game.canvas.getContext("2d");
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(element.x,element.y,element.height,element.width);
        game.score += 10;
    } else {
        console.log('noMore')
    }
}

function contentText (x, y, font, text, name, color ="black"){
    var ctx = game.canvas.getContext("2d");
    ctx.fillStyle = color;
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
            element.callbackFct(element);
        }
    });
}


function playGame(){
	
}