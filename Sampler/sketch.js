let button1;
let button2;
let button3;
let button4;
let delTimeSlider;
let feedbackSlider;
let distortionSlider;

let dist = new Tone.Distortion(0).toDestination();
let del = new Tone.FeedbackDelay(0,0).connect(dist);

function preload() {
  samples = new Tone.Players({
    dog: "media/dog.mp3",
    guitar: "media/guitar.mp3",
    mario: "media/mario.mp3",
    trumpet: "media/trumpet.mp3"
  }).connect(del);
}

function setup() {
  createCanvas(400, 400);
  button1 = createButton("Play Dog Sample");
  button1.position(20,55);
  button1.mousePressed(() => {samples.player("dog").start()});
  button2 = createButton("Play Guitar Sample");
  button2.position(220,55);
  button2.mousePressed(() => {samples.player("guitar").start()});
  button3 = createButton("Play Mario Sample");
  button3.position(15,125);
  button3.mousePressed(() => {samples.player("mario").start()});
  button4 = createButton("Play Trumpet Sample");
  button4.position(215,125);
  button4.mousePressed(() => {samples.player("trumpet").start()});
  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10,200);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});
  feedbackSlider = createSlider(0, 0.99, 0, 0.01);
  feedbackSlider.position(220,200);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value()});
  distortionSlider = createSlider(0, 10, 0, 0.01);
  distortionSlider.position(120,250);
  distortionSlider.input(() => {dist.distortion = distortionSlider.value()});
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 35, 195);
  text("Feedback Time: " + feedbackSlider.value(), 235, 195);
  text("Distortion Time: " + distortionSlider.value(), 140, 245);
}
