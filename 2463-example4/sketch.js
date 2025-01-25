function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  angleMode(DEGREES);
}

function draw() {
  background(255,255,40);
  stroke('white');
  strokeWeight(4);
  fill(128,255,60);
  circle(200,200,200);

  fill(0,255,255);
  beginShape();
  vertex(200,100);
  vertex(225,160);
  vertex(290,160);
  vertex(240,200);
  vertex(265,270);
  vertex(200,230);
  vertex(135,270);
  vertex(160,200);
  vertex(110,160);
  vertex(175,160);
  endShape(CLOSE);
}
