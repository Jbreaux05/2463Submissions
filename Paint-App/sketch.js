let lineHue;
let lineSat;
let lineBright;

function setup() {
  createCanvas(710, 400);
  colorMode(HSB);
  background(255,0,98); 
}

function draw() {
  push();
  stroke(255,255,0);
  strokeWeight(1);
  fill(0,90,90);
  square(0,0,25);
  fill(30,90,180);
  square(0,25,25);
  fill(60,90,150);
  square(0,50,25);
  fill(90,90,90);
  square(0,75,25);
  fill(180,90,90);
  square(0,100,25);
  fill(240,90,90);
  square(0,125,25);
  fill(300,90,90);
  square(0,150,25);
  fill(30,90,40);
  square(0,175,25);
  fill(255,0,255);
  square(0,200,25);
  fill(255,255,0);
  square(0,225,25);
  pop();
}

function mouseClicked() {
  if(mouseX <= 25) {
    if(mouseY <= 25) {
      lineHue = 0;
      lineSat = 90;
      lineBright = 90;
    }
    else if(mouseY > 25 && mouseY <= 50) {
      lineHue = 30;
      lineSat = 90;
      lineBright = 180;
    }
    else if(mouseY > 50 && mouseY <= 75) {
      lineHue = 60;
      lineSat = 90;
      lineBright = 150;
    }
    else if(mouseY > 75 && mouseY <= 100) {
      lineHue = 90;
      lineSat = 90;
      lineBright = 90;
    }
    else if(mouseY > 100 && mouseY <= 125) {
      lineHue = 180;
      lineSat = 90;
      lineBright = 90;
    }
    else if(mouseY > 125 && mouseY <= 150) {
      lineHue = 240;
      lineSat = 90;
      lineBright = 90;
    }
    else if(mouseY > 150 && mouseY <= 175) {
      lineHue = 300;
      lineSat = 90;
      lineBright = 90;
    }
    else if(mouseY > 175 && mouseY <= 200) {
      lineHue = 30;
      lineSat = 90;
      lineBright = 40;
    }
    else if(mouseY > 200 && mouseY <= 225) {
      lineHue = 255;
      lineSat = 0;
      lineBright = 255;
    }
    else if(mouseY > 225 && mouseY <= 250) {
      lineHue = 255;
      lineSat = 255;
      lineBright = 0;
    }
  }
}
function mouseDragged() {
  strokeWeight(10);
  stroke(lineHue, lineSat, lineBright);
  line(pmouseX, pmouseY, mouseX, mouseY);
}