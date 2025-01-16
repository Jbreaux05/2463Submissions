function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  angleMode(DEGREES);
}

function draw() {
  background(255,255,255);
  fill(0);
  square(100,100,100);
  fill(0,100,100,0.7);
  circle(125,125,20);
  circle(175,125,20);
  arc(150,165,75,25,0,180);

  noStroke();
  beginShape();
  vertex(100,100);
  vertex(75,75);
  vertex(125,90);
  vertex(150,60);
  vertex(175,90);
  vertex(190,50);
  vertex(200,100);
  endShape(CLOSE);

  b
}
