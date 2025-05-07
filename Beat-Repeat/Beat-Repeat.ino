const int buttonPins[3] = {2, 3, 4};
const int ledPins[3] = {5, 6, 7};
const int buzzerPin = 8;

bool buttonStates[3] = {false, false, false};

void setup() {
  Serial.begin(9600);

  // Setup buttons as input with pull-up resistors
  for (int i = 0; i < 3; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
    pinMode(ledPins[i], OUTPUT);
  }

  pinMode(buzzerPin, OUTPUT);
}

/*void loop() {
  for (int i = 0; i < 3; i++) {
    bool pressed = digitalRead(buttonPins[i]) == LOW;
    if (pressed && !buttonStates[i]) {
      Serial.print("BTN");
      Serial.println(i + 1);
      buttonStates[i] = true;
    } else if (!pressed && buttonStates[i]) {
      buttonStates[i] = false;
    }
  }
}*/

void loop() {
  // Read button presses
  for (int i = 0; i < 3; i++) {
    bool pressed = digitalRead(buttonPins[i]) == LOW;
    if (pressed && !buttonStates[i]) {
      // Button just pressed
      Serial.print("BTN");
      Serial.println(i + 1); // Send BTN1, BTN2, BTN3
      buttonStates[i] = true;
    } else if (!pressed && buttonStates[i]) {
      // Button released
      buttonStates[i] = false;
    }
  }

  // Check for commands from p5
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd.startsWith("LED")) {
      int index = cmd.substring(3).toInt() - 1;
      if (index >= 0 && index < 3) {
        digitalWrite(ledPins[index], HIGH);
        delay(300); // Light duration
        digitalWrite(ledPins[index], LOW);
      }
    } else if (cmd == "BUZZ") {
      tone(buzzerPin, 200, 500); // 200Hz tone for 500ms
    }
  }
}