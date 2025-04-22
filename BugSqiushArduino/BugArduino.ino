const int xPin = A0;
const int yPin = A1;
const int buttonPin = 2;
const int buzzerPin = 3;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  int xVal = analogRead(xPin);   // Range: 0–1023
  int yVal = analogRead(yPin);
  int btn = digitalRead(buttonPin); // LOW = pressed

  // Format: x,y,pressed
  Serial.print(xVal);
  Serial.print(",");
  Serial.print(yVal);
  Serial.print(",");
  Serial.println(btn == LOW ? 1 : 0);

  // Listen for squish signal from p5.js
  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'S') {  // S = Squish
      digitalWrite(buzzerPin, HIGH);
      delay(100);  // Buzz duration
      digitalWrite(buzzerPin, LOW);
    }
  }

  delay(20);
}