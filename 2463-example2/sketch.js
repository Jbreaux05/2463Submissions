function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  angleMode(DEGREES);
}

function draw() {
  background(0,0,255);
  noStroke();
  fill(0,255,255,0.3);
  circle(200,150,175);
  fill(255,255,255,0.3);
  circle(150,250,175);
  fill(128,255,255,0.3);
  circle(250,250,175);
}
