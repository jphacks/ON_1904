#define DEBUG 1

const int LED = 25;
const int TEST_SW = 26;

void setup() {
  pinMode(LED, OUTPUT_OPEN_DRAIN);
  pinMode(TEST_SW, INPUT_PULLUP);
  digitalWrite(LED, HIGH);
}

void loop() {
  // Debug test mode
  if(DEBUG) {
    digitalWrite(LED, !digitalRead(LED));
    if(digitalRead(TEST_SW) == LOW) {
      delay(300); 
    }
    else {
      delay(10);
    }
  }

  // Get Nage-Sen log records
  
}
