const int potPin = A0;    // Potentiometer connected to analog pin A0
const int ledPin = 9;     // LED connected to PWM pin 9

int brightness = 0;       // LED brightness level
int lastReading = 0;      // Store last potentiometer reading
bool playerTurn = true;   // True for Player 1, False for Player 2

void setup() {
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    int potValue = analogRead(potPin);   // Read potentiometer value (0-1023)
    int mappedValue = map(potValue, 0, 1023, 0, 255); // Convert to PWM range
    
    // Game logic: Increase brightness until threshold, then decrease if exceeded
    if (mappedValue > lastReading) {
        brightness += 10; // Increase brightness
    } else if (mappedValue < lastReading) {
        brightness -= 10; // Decrease brightness
    }
    
    // Clamp brightness between 0-255
    brightness = constrain(brightness, 0, 255);
    
    analogWrite(ledPin, brightness); // Update LED brightness
    lastReading = mappedValue;
    
    // Check if brightness has reached the max (255) to switch turns
    if (brightness == 255) {
        playerTurn = !playerTurn; // Switch turns
        brightness = 0; // Reset brightness for next player
    }
    
    Serial.print("Player Turn: ");
    Serial.print(playerTurn ? "1" : "2");
    Serial.print(" | Brightness: ");
    Serial.println(brightness);
    
    delay(500); // Delay to allow turns
}

/*
Game Objective:
- Players take turns adjusting the potentiometer to increase the LED brightness.

Rules:
- Each player must turn the potentiometer carefully to increase brightness.
- If brightness exceeds the threshold (255), it starts decreasing.
- Each player will adjust the potentiometer without looking at the brightness level on screen. 
- When a player wants to be "done", they can look at the screen and see what level brightness they got to.
- If a player goes over 255, their turn will end, and the player's turn begins.
- Whoever's brightness level is higher wins the game.

Challenge:
- Players must be precise with their movements to avoid overshooting.

Interaction:
- Players physically adjust the potentiometer, affecting LED brightness dynamically.
- Scroll the Potentiometer left to increase brightness. 
- If the scroll is maxed out leftwards, scroll back right to reset your scroll, but right scroll must be fast, as player may just bump brightness back down.
*/
