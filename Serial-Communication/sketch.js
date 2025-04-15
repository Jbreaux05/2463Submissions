let port;
let connectButton;
let buttonStatus = "";
let backgroundColor;
let currentHue = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);

  backgroundColor = color(220);
}

function draw() {
  background(backgroundColor);

  let str = port.readUntil("\n");
  if (str !== "") {
    buttonStatus = str;
    let val = Number(str);
    if (!isNaN(val)) {
      let hue = map(val, 0, 1023, 0, 360);
      backgroundColor = color(hue, 255, 255);
    }
  }
  fill(0);
  textSize(14);
  text("Press 'A' to turn LED ON, 'S' to turn LED OFF", 10, height - 10);
}

function connectToSerial() {
  port.open('Arduino', 9600);
}

function keyPressed() {
  if (key === 'a' || key === 'A') {
    port.write('1');  // Turn LED ON
  } else if (key === 's' || key === 'S') {
    port.write('0');  // Turn LED OFF
  }
}