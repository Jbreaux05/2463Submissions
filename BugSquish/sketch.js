let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});

let gameState = GameStates.START;
let score = 0;
let time = 30;
let textPadding = 15;
let highScore = 0;
let gameFont;
let greenbug;
let bugs = [];
let globalSpeed = 1;

function preload() {
  gameFont = loadFont('media/PressStart2P-Regular.ttf');
  greenbug = loadImage('media/GreenBug.png');
}

function setup() {
  createCanvas(400, 400);
  textFont(gameFont);
  imageMode(CENTER);

  //Ensures spritesheet is loaded before setup
  if (!greenbug) {
    console.error("Greenbug image failed to load.");
    return;
  }
}

function draw() {
  background(220);
  
  switch(gameState) {
    case GameStates.START:
      textAlign(CENTER,CENTER);
      textSize(35);
      text("BUG SQUISH", width/2, height/2 - 150);
      if (!greenbug) {
        console.error("Greenbug image failed to load.");
        return;
      }
      image(greenbug, width/2, height/2, 240, 240, 240, 480, 240, 240);
      textAlign(CENTER,CENTER);
      textSize(18);
      text("Press ENTER to Start", width/2,height/2 + 150);
      break;
    case GameStates.PLAY:
      textSize(16);
      textAlign(LEFT,TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT,TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }
      
      for (let bug of bugs) {
        bug.move();
        bug.display();
      }

      break;
    case GameStates.END:
      textSize(28);
      textAlign(CENTER,CENTER);
      text("Game Over!", width/2, height/2 - 10);

      textSize(16);
      text("Score: " + score, width/2, height/2 + 20);

      if (score > highScore) {
        highScore = score;
      }
      text("High Score: " + highScore, width/2, height/2 + 40);
      text("Press Enter to Play Again", width/2, height/2 + 80);

      break;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === GameStates.START || gameState === GameStates.END) {
      score = 0;
      time = 30;
      globalSpeed = 1;
      gameState = GameStates.PLAY;
      bugs = [];
      for (let i = 0; i < 10; i++) {
        bugs.push(new Bug(random(width), random(height), globalSpeed));
      }
    }
  }
}

function mouseClicked() {
  if (gameState === GameStates.PLAY) {
    for (let i = bugs.length - 1; i >= 0; i--) {
      if (bugs[i].checkClick(mouseX, mouseY)) {
        globalSpeed *= 1.05; //Speeds up the bugs slightly after every squished by
        bugs.push(new Bug(random(width), random(height), globalSpeed));
        for (let b of bugs) b.speed = globalSpeed;
        break;
      }
    }
  }
}

class Bug {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.direction = random(["up", "down", "left", "right"]);
    this.alive = true;
    this.animations = {};
    this.facingDirection = "right";

    //Ensures spritesheet is loaded before assigning animations
    if (greenbug) { 
      this.addAnimation();
      this.currentAnimation = this.animations[this.direction];
    } else {
      console.error("Greenbug image is not loaded yet.");
    }
    }

  addAnimation() {
    this.animations["down"] = new SpriteAnimation(greenbug, 0, 0, 3);
    this.animations["up"] = new SpriteAnimation(greenbug, 0, 1, 3);
    this.animations["left"] = new SpriteAnimation(greenbug, 0, 2, 3);
    this.animations["right"] = new SpriteAnimation(greenbug, 0, 3, 3);
    this.animations["downsquish"] = new SpriteAnimation(greenbug, 0, 4, 1);
    this.animations["upsquish"] = new SpriteAnimation(greenbug, 1, 4, 1);
    this.animations["leftsquish"] = new SpriteAnimation(greenbug, 2, 4, 1);
    this.animations["rightsquish"] = new SpriteAnimation(greenbug, 0, 5, 1);
  }

  move() {
    if (this.alive) {
      switch (this.direction) {
        case "up": this.y -= this.speed; break;
        case "down": this.y += this.speed; break;
        case "left": this.x -= this.speed; break;
        case "right": this.x += this.speed; break;
      }

      if (this.x < 0) this.direction = "right";
      else if (this.x > width) this.direction = "left";
      else if (this.y < 0) this.direction = "down";
      else if (this.y > height) this.direction = "up";

      this.currentAnimation = this.animations[this.direction];
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    this.currentAnimation.draw();
    pop();
  }

  checkClick(mx, my) {
    if (this.alive && dist(mx, my, this.x, this.y) < 20) {
      this.alive = false;
      this.currentAnimation = this.animations[this.direction + "squish"];
      score++;
      return true;
    }
    return false;
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
  }


  draw() {
    image(this.spritesheet, 0, 0, 40, 40, this.u*240, this.v*240, 240, 240);

    this.frameCount++;
    if(this.frameCount % 10 === 0)
      this.u++;
    if(this.u === this.startU + this.duration) {
      this.u = this.startU;
    }
  }
}
