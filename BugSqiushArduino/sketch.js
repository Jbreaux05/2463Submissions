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
let synth;
let synth2;
let startLoop;
let endLoop
let playLoop;
let hasInteracted = false;
let musicChanged = false;
let serial;
let joystickX = 0;
let joystickY = 0;
let buttonPressed = false;
let serialBuffer = "";
let stickspeed = 0.01;
let deadzone = 10;
let joystickZeroX = 512;
let joystickZeroY = 512;
let lastRawX = 512;
let lastRawY = 512;

function preload() {
  gameFont = loadFont('media/PressStart2P-Regular.ttf');
  greenbug = loadImage('media/GreenBug.png');
  sounds = new Tone.Players({
    squish: "media/squish.mp3"
  }).toDestination();
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

  synth = new Tone.Synth().toDestination();

  startLoop = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
  }, [
    "C4", "E4", null, "G4", "A4", "F4", null, "C5", 
    "G4", "B4", null, "A4",["C5","G4"], "C4", null, "G3"   
  ], "8n");

  endLoop = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
  }, [
    "E4", null, "G4", "B4", "D5", null, "C5", "A4",  
    "F4", "G4", null, "E4", "D4", "B3", "C4", ["C4","C4"]
  ], "8n");

  playLoop = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
  }, [
    "C4", null, "E4", "G4", "C5", "B4", "A4", null,  
    "G4", "E4", null, "D4", "F4", "A4", null, "G4"   
  ], "8n");

  playLoop.loop = true;
  startLoop.loop = true;
  endLoop.loop = true;

  serial = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);
  serial.onOpen = () => console.log("Serial port opened");
  serial.onError = (err) => console.error("Serial error:", err);  

  zeroButton = createButton('Zero Joystick');
  zeroButton.mousePressed(zero);

  joystickX = width/2;
  joystickY = height/2;
}

function connectToSerial() {
  serial.open('Arduino', 9600);
}

function startStartScreenMusic() {
  stopAllMusic();
  startLoop.start(0);
  Tone.Transport.bpm.value = 120;
  Tone.Transport.start();
}

function startEndScreenMusic() {
  stopAllMusic();
  endLoop.start(0);
  Tone.Transport.bpm.value = 120;
  Tone.Transport.start();
}

function startGameplayMusic() {
  stopAllMusic();
  playLoop.start(0);
  Tone.Transport.start();
  musicChanged = false;
}

function stopAllMusic() {
  startLoop.stop();
  endLoop.stop();
  playLoop.stop();
  Tone.Transport.stop();
}

function checkTimeRemaining(time) {
  console.log("Time:", time.toFixed(2));
  
  if (!musicChanged && Math.ceil(time) === 10) { 
      console.log("Changing music for last 10 seconds!");
      changeMusicForLast10Seconds();
      musicChanged = true;
  }
}

function changeMusicForLast10Seconds() {
  console.log("Updating music sequence for last 10 seconds!");

  try {
      console.log("Music updated and restarted for last 10 seconds.");
      Tone.Transport.bpm.value *= 1.5;
  } catch (error) {
      console.error("Error in changeMusicForLast10Seconds:", error);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
      if (gameState === GameStates.START) {
          startGameplayMusic();
      } else if (gameState === GameStates.END) {
          startGameplayMusic();
      }
  }
});

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
      if (!hasInteracted) {
        textSize(10);
        text("REQUIRED: Click anywhere to enable sound", width/2, height - 30);
      }

      break;

    case GameStates.PLAY:

      textSize(16);
      textAlign(LEFT,TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT,TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      time -= deltaTime / 1000;

      checkTimeRemaining(time);

      if (time <= 0.01) {
        time = 0;
        gameState = GameStates.END;
        stopAllMusic();
        startEndScreenMusic();
      }
      
      for (let bug of bugs) {
        bug.move();
        bug.display();
      }

      if (buttonPressed) {
        console.log("Button Pressed");
        for (let i = bugs.length - 1; i >= 0; i--) {
          if (bugs[i].checkClick(joystickX, joystickY)) {
            globalSpeed *= 1.05;
            bugs.push(new Bug(random(width), random(height), globalSpeed));
            for (let b of bugs) b.speed = globalSpeed;
            sounds.player("squish").start();
    
            // Send squish event to Arduino
            if (serial) {
              serial.write('S');
            }
    
            break;
          }
        }
      }
    
      let line = serial.readUntil('\n');
      if (line !== "") {
        const parts = line.trim().split(",");
        if (parts.length === 3) {
          let rawX = Number(parts[0]);
          let rawY = Number(parts[1]);
          let btn = Number(parts[2]);
          lastRawX = rawX;
          lastRawY = rawY;

          let dx = rawX - 512;
          let dy = rawY - 512;

          if (abs(dx) < deadzone) dx = 0;
          if (abs(dy) < deadzone) dy = 0;

          joystickX += dx * stickspeed;
          joystickY += dy * stickspeed;

          joystickX = constrain(joystickX, 0, width);
          joystickY = constrain(joystickY, 0, height);
          buttonPressed = btn === 1;

          console.log("🕹️", joystickX, joystickY, "🖲️", buttonPressed);
        }
      }

      fill(buttonPressed ? 'red' : 'black');
      circle(joystickX, joystickY, 25);
      fill(0);

      break;

    case GameStates.END:
      fill(0);
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
      Tone.Transport.bpm.value = 120;
      startGameplayMusic();

      joystickX = width / 2;
      joystickY = height / 2;
      buttonPressed = false;

      if (serial && serial.opened()) {
        serial.clear(); // Clears the serial input buffer
      }
    }
  }
}


function mouseClicked() {
  if (!hasInteracted) {
    Tone.start(); // Ensure audio context starts on user interaction
    hasInteracted = true;
    startStartScreenMusic();
  }

  /*if (gameState === GameStates.PLAY) {
    for (let i = bugs.length - 1; i >= 0; i--) {
      if (bugs[i].checkClick(mouseX, mouseY)) {
        globalSpeed *= 1.05; //Speeds up the bugs slightly after every squished by
        bugs.push(new Bug(random(width), random(height), globalSpeed));
        for (let b of bugs) b.speed = globalSpeed;
        sounds.player("squish").start();
        break;
      }
    }
  }*/
}

function zero() {
  joystickZeroX = lastRawX;
  joystickZeroY = lastRawY;
  console.log("Joystick zeroed at:", joystickZeroX, joystickZeroY);
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
