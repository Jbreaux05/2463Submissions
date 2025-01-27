function setup() {
  createCanvas(400, 200);
  colorMode(HSB);
  angleMode(DEGREES);
}

function draw() {
  background(0,255,0);
  fill(64,255,255);
  arc(100,100,150,150,225,135);

  noStroke();
  fill(0,255,255);
  arc(300,100,150,150,180,0);
  rect(225,100,150,75);
  fill('white');
  circle(265,100,40);
  circle(335,100,40);
  fill('blue');
  circle(265,100,25);
  circle(335,100,25);
}
