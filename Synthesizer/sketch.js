let synth;
let filter;
let reverb;

let keyNotes = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5',
  'w': 'C#4',
  'e': 'D#4',
  't': 'F#4',
  'y': 'G#4',
  'u': 'A#4',
  'o': 'C#5'
}

function setup() {
  createCanvas(600, 600);
  reverb = new Tone.Reverb({
    decay: 3,
    wet: 0.3
  }).toDestination();
  filter = new Tone.Filter(1000,'lowpass').connect(reverb);
  synth = new Tone.PolySynth(Tone.Synth).connect(filter);

  filterFreqSlider = createSlider(100, 5000, 0, 1);
  filterFreqSlider.position(100, 500);

  filterResSlider = createSlider(0, 10, 0, 0.1);
  filterResSlider.position(350, 500);
}


function draw() {
  background(220);
  fill(255);
  rect(60,150,60,250);
  rect(120,150,60,250);
  rect(180,150,60,250);
  rect(240,150,60,250);
  rect(300,150,60,250);
  rect(360,150,60,250);
  rect(420,150,60,250);
  rect(480,150,60,250);
  fill(0);
  rect(100,150,40,150);
  rect(160,150,40,150);
  rect(280,150,40,150);
  rect(340,150,40,150);
  rect(400,150,40,150);
  rect(510,150,30,150);
  textAlign(CENTER);
  textSize(24);
  textFont("TimesNewRoman");
  text('a',90,350);
  text('s',150,350);
  text('d',210,350);
  text('f',270,350);
  text('g',330,350);
  text('h',390,350);
  text('j',450,350);
  text('k',510,350);
  fill(255);
  text('w',120,250);
  text('e',180,250);
  text('t',300,250);
  text('y',360,250);
  text('u',420,250);
  text('o',525,250);

  fill(0);
  textSize(16);
  text("Filter Frequency: " + filterFreqSlider.value(), 170, 490);
  text("Filter Resonance: " + filterResSlider.value(), 415, 490);

  filter.frequency.value = filterFreqSlider.value();
  filter.Q.value = filterResSlider.value();
}

function keyPressed() {
  let pitch = keyNotes[key];
  if (pitch) {
    synth.triggerAttack(pitch);
  }
}

function keyReleased() {
  let pitch = keyNotes[key];
  if (pitch) {
    synth.triggerRelease(pitch);
  }
}