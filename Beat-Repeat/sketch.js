let serial; // p5.serialport object
let serialBuffer = "";

let gameState = "start"; // start, instructions, play, gameover
let level = 1;
let score = 0;
let highScore = 0;

let pattern = [];
let userIndex = 0;
let showingPattern = false;

let colors = ["red", "green", "blue"];
let notes = ["C4", "E4", "G4"];
let synth;

let circlePositions = [];

let activeCircle = -1;

let lastInputTime = 0;
const debounceDelay = 300;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  synth = new Tone.Synth().toDestination();

  // Set up serial
  serial = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);
  

  // Circle positions
  for (let i = 0; i < 3; i++) {
    circlePositions.push({
      x: width / 4 * (i + 1),
      y: height / 2,
      r: 60
    });
  }
}

function connectToSerial() {
  serial.open('Arduino', 9600);
}

function draw() {
  background(30);

  if (gameState === "start") drawStart();
  else if (gameState === "instructions") drawInstructions();
  else if (gameState === "play") drawGame();
  else if (gameState === "gameover") drawGameOver();
}

// --- Game States ---
function drawStart() {
  fill(255);
  textSize(50);
  text("Beat Repeat", width / 2, height / 2);
  textSize(24);
  text("Click to Start", width / 2, height / 2 + 75);
}

function drawInstructions() {
  fill(255);
  textSize(18);
  text("Watch and listen to the sequence on Screen!", width / 2, height / 3);
  text("Use the physical buttons to repeat the sequence.", width / 2, height / 3 + 30);
  text("Click to Begin", width / 2, height / 2 + 40);
}

function drawGame() {
  for (let i = 0; i < 3; i++) {
    let c = color(colors[i]);
    if (i === activeCircle) {
      // Brightened stroke and slightly larger for visual feedback
      stroke(255);
      strokeWeight(6);
      fill(c);
      ellipse(circlePositions[i].x, circlePositions[i].y, circlePositions[i].r * 2 + 20);
    } else {
      noStroke();
      fill(lerpColor(c, color(50), 0.5)); // Dimmed base color
      ellipse(circlePositions[i].x, circlePositions[i].y, circlePositions[i].r * 2);
    }
  }

  noStroke();
  fill(255);
  textSize(20);
  text("Level: " + level, width / 2, 40);
  text("Score: " + score, width / 2, 70);

  let line = serial.readUntil('\n');
  if (line !== "") {
    line = line.trim();
    console.log("Serial received:", line);
    if (line.startsWith("BTN")) {
      let btnIndex = int(line.charAt(3)) - 1;
      handleUserInput(btnIndex);
    }
  } 
}

function drawGameOver() {
  fill(255);
  textSize(32);
  text("Game Over!", width / 2, height / 3);
  textSize(20);
  text("Score: " + score, width / 2, height / 2);
  text("High Score: " + highScore, width / 2, height / 2 + 30);
  text("Click to Restart", width / 2, height / 2 + 80);
}

// --- Input ---
function mousePressed() {
  if (gameState === "start") {
    gameState = "instructions";
  } else if (gameState === "instructions") {
    startGame();
  } else if (gameState === "gameover") {
    startGame();
  }
}

// --- Game Logic ---
function startGame() {
  level = 1;
  score = 0;
  pattern = [];
  userIndex = 0;
  gameState = "play";
  addToPattern();
  showPattern();
}

function addToPattern() {
  pattern.push(floor(random(3))); // add random 0-2
}

function showPattern() {
  showingPattern = true;
  let now = Tone.now();
  pattern.forEach((val, i) => {
    // Queue playCircle at future times
    setTimeout(() => {
      playCircle(val);
      if (i === pattern.length - 1) {
        showingPattern = false;
        userIndex = 0;
      }
    }, i * 700); // still use visual delay
  });
}

function playCircle(index) {
  flashCircle(index); // Visual
  let now = Tone.now();
  synth.triggerAttackRelease(notes[index], "8n", now); // <-- explicit time
  serial.write("LED" + (index + 1) + "\n");
}

function playUserCircle(index) {
  // Only called when user presses button
  flashCircle(index);
  let now = Tone.now();
  synth.triggerAttackRelease(notes[index], "8n", now);
  serial.write("LED" + (index + 1) + "\n");
}

function playSuccessJingle() {
  let chord = ["C5", "E5", "G5"];
  let now = Tone.now();
  chord.forEach((note, i) => {
    synth.triggerAttackRelease(note, "8n", now + i * 0.05);
  });

  setTimeout(showPattern, 1000);
}

function flashCircle(index) {
  activeCircle = index;
  setTimeout(() => {
    activeCircle = -1;
  }, 300); // glow duration
}

function serialEvent() {
  while (serial.available()) {
    let inChar = serial.read();

    if (inChar === '\n') {
      let input = serialBuffer.trim();
      console.log("Serial received:", input);

      if (input.startsWith("BTN")) {
        let btnIndex = int(input.charAt(3)) - 1;
        handleUserInput(btnIndex);
      }

      serialBuffer = ""; // reset buffer
    } else {
      serialBuffer += inChar;
    }
  }
}

function handleUserInput(index) {
  let now = millis();

  if (now <= lastInputTime) {
    now = lastInputTime + 1; // Increment by 1ms to ensure the "strictly greater" condition
  }

  if (now - lastInputTime < debounceDelay) return; // debounce
  lastInputTime = now;

  if (showingPattern || gameState !== "play") return;

  playUserCircle(index); // Sound + send LED signal

  if (index === pattern[userIndex]) {
    userIndex++;
    if (userIndex >= pattern.length) {
      playSuccessJingle();
      level++;
      score += 10;
      addToPattern();
      setTimeout(showPattern, 1000);
    }
  } else {
    serial.write("BUZZ\n");
    highScore = max(score, highScore);
    gameState = "gameover";
  }
}