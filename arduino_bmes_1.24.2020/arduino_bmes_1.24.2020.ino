#include <SoftwareSerial.h>
#define INPUT_PIN A0
int data = 0;

SoftwareSerial mySerial(7, 8); // RX, TX  

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  
  mySerial.begin(9600);
  mySerial.print("AT+RENEW");
  digitalWrite(INPUT_PIN, HIGH);
}

bool reverse = false;
void loop() {
  // put your main code here, to run repeatedly:
  
  if ( data == 100)
    reverse = true;
  else if ( data == 0)
    reverse = false;
  data = reverse ? data - 1 : data + 1;
  
  /*data = analogRead(INPUT_PIN);*/
  byte buffer[3] = {
    0xAD, 
    (byte)(data),
    (byte)(data >> 8)
  };
  
  Serial.println(data);
  mySerial.write(buffer, sizeof(buffer));
  delay(10);
}
