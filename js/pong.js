// select canvas element
const canvas = document.getElementById("myCanvas");

// getContext function is the function that we use to get access to the canvas tags 2D drawing functions
const ctx = canvas.getContext('2d');

// load sounds
let hit = new Audio("sounds/hit.mp3");
let wall = new Audio("sounds/wall.mp3");
let userScore = new Audio("sounds/comScore.mp3");
let comScore = new Audio("sounds/userScore.mp3");

const width = 400;
const height = 600;
const requiredScore = 5;

// canvas width and height
canvas.width = width;
canvas.height = height;

// ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,      // speed in x-axis/width
    velocityY : 5,      // speed in y-axis/height
    speed : 7,
    color : "WHITE"
}

// user paddle object
const user = {
    x : (canvas.width - 100)/2,
    y : canvas.height - 10,
    width : 100,
    height : 10,
    score : 0,
    color : "WHITE"
}

// computer paddle object
const com = {
    x : (canvas.width - 100)/2,
    y : 0,
    width : 100,
    height : 10,
    score : 0,
    color : "WHITE"
}

// net (center dotted line) object
const net = {
    x : 0,
    y : (canvas.height - 2)/2,
    height : 2,
    width : 10,
    color : "WHITE"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

// draw the net
function drawNet(x, y, w, h, color) {
    for(let i = 0; i <= canvas.width; i+=15) {
        drawRect(x + i, y, w, h, color);
    }
}

// draw text
function drawText(text, x, y, color, font) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    // return the size of an element and its position relative to the viewport
    let rect = canvas.getBoundingClientRect();

    // get mouse x and adjust for user paddle
    user.x = evt.clientX - rect.left - user.width/2;
}

// when COMPUTER or USER scores, we reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityY = -ball.velocityY;
    ball.speed = 7;
}

// collision detection
function collision(ball, player){
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;
    
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    
    return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
}

// update function, the function that does all calculations
function update() {
    
    // change the score of players, 
    // if the ball goes to the bottom "bottom of ball > height of canvas" computer win,
    // else if the ball goes to the top "top of ball < 0" the user win
    if( ball.y + ball.radius > canvas.height ) {
        com.score++;
        // play sound
        comScore.play();
        resetBall();
    }
    else if( ball.y - ball.radius < 0) {
        user.score++;
        // play sound
        userScore.play();
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
    com.x += ((ball.x - (com.x + com.width/2))*0.1);
    
    // when the ball collides with left and right walls we inverse the x velocity.
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.velocityX = -ball.velocityX;
        // play sound
        wall.play();
    }
    
    // we check if the paddle hit the user or the com paddle
    let player = (ball.y + ball.radius > canvas.height/2) ? user : com;
    
    // if the ball hits a paddle
    if (collision(ball, player)) {
        // play sound
        hit.play();

        // we check where the ball hits the paddle
        let collidePoint = (ball.x - (player.x + player.width/2));

        // normalize the value of collidePoint, we need to get numbers between -1 and 1 i.e, (-1 <= collidePoint <= 1)
        // left = -1, center = 0, right = 1
        collidePoint = collidePoint/(player.width/2);
        
        // when the ball hits the center of the paddle we want the ball to take a 90 degrees angle
        // when the ball hits the left of a paddle we want the ball, to take a -45 degees angle
        // when the ball hits the right of the paddle we want the ball to take a 45 degrees angle
        let angleRadian = (Math.PI/4) * collidePoint;

        // change the X and Y velocity direction
        // direction = -1 (when user hits the ball) and direction = 1 (when computer hits the ball)
        let direction = (ball.y + ball.radius > canvas.height/2) ? -1 : 1;
        ball.velocityY = direction * ball.speed * Math.cos(angleRadian);
        ball.velocityX = ball.speed * Math.sin(angleRadian);
        
        // speed up the ball everytime a paddle hits it
        ball.speed += 0.1;
    }
}

// render function, the function that does all the drawing
function render() {
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#005236");
    
    // draw the computer and its score to the top
    drawText("COMPUTER", canvas.width/2 - 86, canvas.height/4, "#fff", "38px fantasy");
    drawText(com.score, 20, canvas.height/2 - 20, "#FFF", "48px fantasy");
    
    // draw the user and its score to the bottom
    drawText("USER", canvas.width/2 - 40, canvas.height/1.25, "#fff", "38px fantasy");
    drawText(user.score, 20, canvas.height/2 + 58, "#FFF", "48px fantasy");

    // draw the computer's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw the net
    drawNet(net.x, net.y, net.width, net.height, net.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
    if (com.score < requiredScore && user.score < requiredScore) {
        update();
        render();
    }

    else if (com.score >= requiredScore || user.score >= requiredScore) {
        gameOver();
        return;
    }
    
}

function gameOver() {
        // clear the canvas
        drawRect(0, 0, canvas.width, canvas.height, "#005236");
        // draw computer winner message
        drawText("GAME OVER", canvas.width/2 - 58, canvas.height/2, "#FFF", "25px fantasy");

        if (com.score > user.score) {
            // draw computer win message
            drawText("COMPUTER WIN", canvas.width/2 - 80, canvas.height/2 + 30, "yellow", "25px fantasy");
        }

        else if (com.score < user.score) {
            // draw user win message
            drawText("USER WIN", canvas.width/2 - 52, canvas.height/2 + 30, "yellow", "25px fantasy");
        }

        else {
            // draw match tie message
            drawText("MATCH TIE", canvas.width/2 - 55, canvas.height/2 + 30, "yellow", "25px fantasy");
        }
}

function beforeStart() {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#005236");

    // draw message before starting game
    drawText("PRESS ENTER TO START THE GAME", canvas.width/2 - 158, canvas.height/2, "#FFF", "25px fantasy");
}

beforeStart();

// number of frames per second
let framePerSecond = 50;

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        // call the game function 50 times every 1 Sec
        setInterval(game, 1000/framePerSecond);
    }
})