
const int ledPin = 13;    // the number of the LED pin
const int sensorPin = A0;

void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  pinMode(sensorPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // --- Handle incoming serial commands from p5.js ---
  if (Serial.available() > 0) {
    char command = Serial.read();
    if (command == '1') {
      digitalWrite(ledPin, HIGH);
    } else if (command == '0') {
      digitalWrite(ledPin, LOW);
    }
  }

  int sensorValue = analogRead(sensorPin);
  Serial.println(sensorValue);
  delay(16);
}
