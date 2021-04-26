//original: https://editor.p5js.org/hanxyn888@gmail.com/sketches/ZxECx8dXY
var paddle;
var ball;
var bricks = [];
var playingGame = false;
var youWin = false;
var life = 3;
var score = 0;
var sp = 5;

//function preload() {
//  endgame = loadSound("sounds/over.wav")
//  eaten = loadSound("sounds/win.wav")
//  win = loadSound("sounds/winning.wav")
//}

function setup() {
  var canvas = createCanvas(640, 480);
  //  canvas.position(windowWidth/2-320, 0)
  paddle = new Paddle();
  ball = new Ball();
  //a = createA('https://editor.p5js.org/Tedy/present/4fPEaHotI', 'Go to level 2!!!', 'self');
  // a.position(650, 10)
  for (let i = 0; i < 25; i++) {
    bricks.push(new Brick());
  }
  h = createElement('p', 'Lives: ' + 3)
  s = createElement('p', 'Score: ' + 0)
}

function draw() {
  background(230, 248, 253);

  paddle.display();
  ball.color(0, 149, 221);
  ball.display();
  //Checking if playing game
  if (playingGame) {
    paddle.update();
    paddle.checkEdges();
    ball.update();
    ball.checkEdges();
  }
  //Checking if the ball hits the paddle
  if (ball.meets(paddle) && ball.direction.y > 0) {
    ball.direction.y *= -1;
  }
  //If the ball hits a brick
  for (var j = bricks.length - 1; j >= 0; j--) {
    if (ball.hits(bricks[j])) {
      if (bricks[j].r > 20) {
        bricks[j].r = bricks[j].r / 2;
      } else {
        bricks.splice(j, 1);
      }
      ball.direction.y *= -1;
    } else {
      bricks[j].display();
    }
  }
  // Losing the game
  if (ball.pos.y > height) {
    playingGame = false;
    life = life - 1
    sp = sp - random(1, 2)
    h.html("Lives: " + life)
    if (life == 2) {
      for (let i = 0; i < 10; i++) {
        bricks.push(new Brick());
      }
    }
    if (life == 1) {
      sp = -sp
    }
    if (life == 0) {
      background(31, 115, 172);
      h2 = createElement('h2', 'GAME OVER')
      h2.position(width / 2 - 160, 170)
      var button = createButton('try again')
      button.mousePressed(resetGame)
      button.position(width / 2 - 20, 290)
    //  endgame.play()
      noLoop();
    }
    ball.pos = createVector(width / 2, height / 2);

  }
 //Winning game
  if (bricks.length === 0) {
    youWin = true;
    playingGame = false;
   // win.play()
    noLoop();
  }
 
  if (youWin) {
    // textSize(32);
    //fill(0);
    // noStroke();
    background(228, 241, 250)
    // text("You win!", width / 2 - 50, 80);
    h1 = createElement('h1', 'YOU WIN!!!')
    h1.position(width / 2 - 130, 170)
    var button = createButton('try again')
    button.mousePressed(resetGame)
    button.position(width / 2 - 20, 290)
    a = createA('https://editor.p5js.org/Tedy/present/4fPEaHotI', 'Go to level 2!!!', 'self');
    a.position(290, 340)
  }
}
//Controls
function keyPressed() {
  if (key === "a" || key === "A" || keyCode === LEFT_ARROW) {
    paddle.isMovingLeft = true;
  } else if (key === "d" || key === "D" || keyCode === RIGHT_ARROW) {
    paddle.isMovingRight = true;
  } else if (key === "s" || key === "S" || key === " ") {
    playingGame = true;
    youWin = false;
    if (bricks.length === 0) {
      for (var i = 0; i < bricks.length; i++) {
        bricks.push(new Bricks());
      }
    }
  }
}

function keyReleased() {
  paddle.isMovingLeft = false;
  paddle.isMovingRight = false;
}
//Restarting the game
function resetGame() {
  location.reload();
}
function Ball() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 15;
  this.direction = createVector(0.5, 0.5);
  this.vel = createVector(4, 4);
  this.color = function(r, g, b) {
    fill(r, g, b);}
 //Display the ball
  this.display = function() {
    //fill(0, 149, 221);
    stroke(0, 75, 110);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  };
  //Update the coordinates of the ball
  this.update = function() {
    this.pos.x += this.vel.x * this.direction.x;
    this.pos.y += this.vel.y * this.direction.y;
  };
  //Checking if the ball hits an edge 
  this.checkEdges = function() {
    if (this.pos.y < this.r && this.direction.y < 0) {
      this.direction.y *= -1;
    //  ball.color(100,149,221);
    } else if (this.pos.x < this.r && this.direction.x < 0) {
      this.direction.x *= -1;
    } else if (this.pos.x > width - this.r && this.direction.x > 0) {
      this.direction.x *= -1;
     // ball.color(100,149,221);
    }
  };
  //What happenes when the ball and the paddle meet
  this.meets = function(paddle) {
    if (this.pos.y < paddle.pos.y &&
        this.pos.y > paddle.pos.y - this.r &&
        this.pos.x > paddle.pos.x - this.r &&
        this.pos.x < paddle.pos.x + paddle.w + this.r) {//eaten.play()                                        
      return true;
      
    } else {
      return false;
    }
    
  };
  //What happenes when the ball and a brick meet
  this.hits = function(brick) {
    var distance = dist(this.pos.x, this.pos.y, brick.pos.x, brick.pos.y);
    if (distance < this.r + brick.r) {
    //   eaten.play()                               
        score = score+1                                  
                                                        s.html("Score: "+ score) 
      return true;
    } else {
      return false;
    }
  };
}
function Paddle() {
  this.w = 80;
  this.h = 10;
  
  this.isMovingLeft = false;
  this.isMovingRight = false;
  
  this.pos = createVector(width / 2, height - 20);
  
  //display the paddle
  this.display = function() {
    fill(0, 149, 221);
    stroke(0, 75, 110);
    strokeWeight(2);
    rect(this.pos.x, this.pos.y, this.w, this.h);
  };
  //How the paddle moves
  this.move = function(step) {
    this.pos.x += step;
  };
  //Update the coordinates of the paddle
  this.update = function() {
    if (this.isMovingRight) {
      this.move(sp);
    } else if (this.isMovingLeft) {
      this.move(-sp);
    }
  };
  //Checking if the paddle hits an edge 
  this.checkEdges = function() {
    if (this.pos.x < 0) {
      this.pos.x = 0;
    } else if (this.pos.x > width - this.w) {
      this.pos.x = width - this.w;
    }
  };
}
function Brick() {
  this.r = random(10, 40);
  this.pos = createVector(random(50, width - 50), random(50, height - 200));
  this.total = 6;
  //Display a brick
  this.display = function() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(153, 255, 255);
    stroke(76, 128, 128);
    strokeWeight(2);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      let angle = map(i, 0, this.total, 0, TWO_PI);
      var x = this.r * cos(angle);
      var y = this.r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  };
}