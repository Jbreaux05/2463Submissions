const int button1 = 2;  // Button 1 input pin
const int button2 = 3;  // Button 2 input pin
const int led1 = 9;     // LED 1 output pin
const int led2 = 10;    // LED 2 output pin

int buttonState = 0;  // Stores which button is currently pressed

void setup() {
  pinMode(button1, INPUT);  
  pinMode(button2, INPUT);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop() {
  // Read the state of each button
  if (digitalRead(button1) == HIGH) {
    buttonState = 1;  // Button 1 is pressed
  } 
  else if (digitalRead(button2) == HIGH) {
    buttonState = 2;  // Button 2 is pressed
  } 
  else {
    buttonState = 0;  // No button is pressed
  }

  // Act based on buttonState
  if (buttonState == 1) {
    flickerFast();
  } 
  else if (buttonState == 2) {
    eerieBlink();
  } 
  else {
    // Turn off LEDs when no button is pressed
    digitalWrite(led1, LOW);
    digitalWrite(led2, LOW);
  }
}

void flickerFast() {
  // Flickers rapidly while button is held
  digitalWrite(led1, random(2));
  digitalWrite(led2, random(2));
  delay(random(50, 200)); // Fast flickering delay
}

void eerieBlink() {
  // Alternating eerie blinking while button is held
  digitalWrite(led1, HIGH);
  digitalWrite(led2, LOW);
  delay(random(500, 1500)); // Slow eerie blink delay
  digitalWrite(led1, LOW);
  digitalWrite(led2, HIGH);
  delay(random(500, 1500));
}