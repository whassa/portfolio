const DEFAULT_SQUARE_SIZE = 50;
const DEFAULT_TIME_BETWEEN_SHOT = 2000;
const DEFAULT_MAX_TIME = 60;
var frames = 0;
var gameElements = [];
var headerSize = 40;
var squareSize, timeBetweenShot;

var game = {
    score: 0,
    maxTime: DEFAULT_MAX_TIME,
    time: 0,
    canvas: document.createElement("canvas"),
    inputSize: null,
    inputDelay: null,
    inputMaxTime: null,
    startButton: function() {
        this.clear();
        gameElements = [];
        this.time = this.maxTime;
        showTime();
        this.countDown();
    },
    start: function() {
        this.clear();
        this.score = 0;
        renderGameItems();
        this.timeInterval = setInterval(function(){ updateTime();}, 1000);
        this.gameInterval = setInterval(function(){ updateGameArea();}, timeBetweenShot);
    },
    load: function() {
        this.canvas.width = 1000;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.canvas.addEventListener('click', canvaIsClicked, false);
  	},
    clear: function() {
        //clearInterval(this.interval)
        this.context.clearRect(0, headerSize, this.canvas.width, this.canvas.height);
        this.context.clearRect(game.canvas.width-120, 0, 120, 40);
    },
    menu: function() {
        this.clear();
        gameElements = [];
        contentText(this.canvas.width/2-100, 300, "italic 30px Arial", "Project Target")
        menuButton(this.canvas.width/2-50, 350, 100, 50, () => { game.startButton() }, "start");
        menuButton(this.canvas.width/2-50, 420, 100, 50, () => { game.setting() }, "settings");
    },
    countDown: function( number ) {
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
    gameOver: function(){
        gameElements = [];
        clearInterval(this.gameInterval);
        clearInterval(this.timeInterval);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        contentText(this.canvas.width/2-100, 300, "italic 30px Arial", "Final Score : "+ game.score);
        menuButton(this.canvas.width/2-95, 350, 180, 50, () => { game.menu() }, "Return to menu");
    },
    setting: function(){
        gameElements = [];
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        contentText(this.canvas.width/2 - 200, 275, "bold 20px Arial", 'Square size :');
        this.inputSize = new CanvasInput({
            canvas: game.canvas,
            x: game.canvas.width/2-65,
            y: 250,
            fontSize: 18,
            fontColor: '#212121',
            fontFamily: 'Arial',
            width: 300,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 4,
            placeHolder: 'Between 5 and 200',
            value: squareSize,
        })
        //( in milliseconds ) 
        contentText(this.canvas.width/2 - 300, 375, "bold 20px Arial", "Delay between square :" );
        contentText(this.canvas.width/2 - 275, 400, "bold 20px Arial", "( in milliseconds ) " );
        this.inputDelay = new CanvasInput({
            canvas: game.canvas,
            x: game.canvas.width/2-65,
            y: 350,
            fontSize: 18,
            fontColor: '#212121',
            fontFamily: 'Arial',
            width: 300,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 4,
            placeHolder: 'Between 100 and 100000',
            value: timeBetweenShot,
        })
        this.inputSize.focus();
        menuButton(this.canvas.width/2-75, 450, 100, 50, () => { game.save() }, "Save");
        menuButton(this.canvas.width/2+75, 450, 100, 50, () => { game.returnToMenu() }, "Cancel");
    },
    returnToMenu: function(){
        this.inputSize.destroy();
        this.inputDelay.destroy();
        //this.inputSize =  null;
        //this.inputDelay =  null;
        this.menu();
    },
    save: function(){
        if (this.inputSize.value() >= 5 && this.inputSize.value() <= 200) {
            squareSize = this.inputSize.value();
            setCookie('squareSize', squareSize, 730);
        }
        if (this.inputDelay.value() >= 100 && this.inputDelay.value() <= 100000) {
            timeBetweenShot = this.inputDelay.value();
            setCookie('timeBetweenShot', timeBetweenShot, 730);
        }
        this.returnToMenu();
    }
    
}

function startGame(){
    cookiesReaderStart();
    game.load();
    game.menu();
}


function updateGameArea (){
    renderGameItems();
}

function renderGameItems(){
    game.clear();
    showScore();
    generateRandomSquare();
}


function showScore(){
    contentText(game.canvas.width-120, 20, "bold 20px Arial", "Score : "+ game.score);
}

function handleTime(){
    let minute =  game.time/60;
    let secLeft = game.time%60;
    if (secLeft < 10){
        secLeft = ("0" + secLeft).slice(-2);
    }
    minute = Math.floor(minute);

    const time = minute + ":"+secLeft;
    return time;
}

function updateTime(){

    game.time -= 1;
    if (game.time <= 0){
        game.gameOver();
    } else {
        showTime();
    }
}

function showTime(){   

    ctx = game.canvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 40);
    contentText(20, 20,  "bold 20px Arial", "Time left : "+ handleTime())
    
}

function generateRandomSquare(){
    gameElements = [];

    let randomX = rando(0, game.canvas.width-squareSize);
    let randomY = rando(headerSize, game.canvas.height-squareSize);

    var ctx = game.canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(randomX,randomY,squareSize,squareSize);

    gameElements.push({ 
        x: parseInt(randomX),
        y: parseInt(randomY),
        width: parseInt(squareSize),
        height: parseInt(squareSize),
        callbackFct: squareIsClicked,
    });
}

function squareIsClicked(element){
    if( !element.isClick){
        element.isClick = true;
        game.score += 10;
        game.clear();
        var ctx = game.canvas.getContext("2d");
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(element.x,element.y,element.height,element.width);
        showScore();
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
    var style = window.getComputedStyle(game.canvas);
    var rect = game.canvas.getBoundingClientRect();
    var x = event.pageX - rect.top;
    var y = event.pageY - rect.left;
    gameElements.forEach(function(element) {
        if (y > element.y 
            && y < element.y + element.height 
            && x > element.x
            && x < element.x + element.width
        ) {
            element.callbackFct(element);
        }
    });
}

function cookiesReaderStart(){
    squareSize = getCookie('squareSize');
    timeBetweenShot = getCookie('timeBetweenShot');
    game.maxTime =  getCookie('maxTime');
    if (squareSize === ""){
        squareSize = DEFAULT_SQUARE_SIZE;
        setCookie('squareSize', squareSize, 730);
    }

    if (timeBetweenShot === ""){
        timeBetweenShot = DEFAULT_TIME_BETWEEN_SHOT;
        setCookie('timeBetweenShot', timeBetweenShot, 730);
    } 

    if (game.maxTime === ""){
        game.maxTime = DEFAULT_MAX_TIME;
        setCookie('maxTime', game.maxTime, 730);
    }

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}