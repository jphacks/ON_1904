#include <WiFi.h>
#include <HTTPClient.h>

#define DEBUG 1

const int LED = 25;
const int TEST_SW = 26;

const int BLINK_COUNT = 5;

// --- Wifi settings ---
const char* ssid = "SSID";
const char* password = "PASS";

// --- Last Nage-Sen history API ---
const char* host = "https://example.com";

void setup() {
  pinMode(LED, OUTPUT_OPEN_DRAIN);
  pinMode(TEST_SW, INPUT_PULLUP);
  digitalWrite(LED, HIGH);
}

void loop() {
  // Debug test mode
  if(DEBUG) {
    if(digitalRead(TEST_SW) == LOW) {
      digitalWrite(LED, !digitalRead(LED));
      delay(200); 
    }
    else {
      digitalWrite(LED, LOW);
    }
    return;
  }

  // Get Nage-Sen log records
  if(is_nagesen_payed()) {
    for(int i=0; i < BLINK_COUNT * 2; i++) {
      digitalWrite(LED, !digitalRead(LED));
      delay(200);
    }
    // Activate LED
    digitalWrite(LED, LOW);
  }
}

bool is_nagesen_payed() {
  HTTPClient http;
  http.begin(host);
  int httpCode = http.POST("");

  return httpCode == 200;
}
