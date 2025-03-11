let img;
let synth, noise, filter, noiseEnv;
let playing = false;

function preload() {
  img = loadImage('media/monkey.jpg');
}
function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
 
  synth = new Tone.FMSynth({
    harmonicity: 2.5,
    modulationIndex: 10,
    envelope: {
      attack: 2,
      decay: 0.2,
      sustain: 0.1,
      release: 0.2
    },
    modulation: {
      type: "square" //modulation
    }
  }).toDestination();
  synth.volume.value = 0;

  noise = new Tone.Noise("white"); //noise
  filter = new Tone.Filter(1000, "lowpass").toDestination(); //filter
  noiseEnv = new Tone.AmplitudeEnvelope({ //Envelope
    attack: 0.005,
    decay: 0.1,
    sustain: 0.0,
    release: 0.2
  }).toDestination();
  
  noise.connect(filter);
  filter.connect(noiseEnv);
  noise.volume.value = -10;

  lfo = new Tone.LFO(5, 500, 1500).connect(filter.frequency).start(); //LFO modulation

}

function draw() {
  background(220);
  if (playing) {
    image(img, width / 2, height / 2, 200, 200);
  } else {
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("Click to Find the Monkey", width / 2, height / 2);
  }
}

function mousePressed() {
  playing = true;

  synth.triggerAttackRelease("C4", "4n");
  noise.start();
  noiseEnv.triggerAttackRelease("8n");
  
  setTimeout(() => {
    playing = false;
    noise.stop();
  }, 750);
}
