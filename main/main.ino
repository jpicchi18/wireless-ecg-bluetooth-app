/*
  Software serial multple serial test

 Receives from the hardware serial, sends to software serial.
 Receives from software serial, sends to hardware serial.

 The circuit:
 * RX is digital pin 2 (connect to TX of other device)
 * TX is digital pin 3 (connect to RX of other device)

 */
#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3); // RX, TX

int t = 0;
int pin = A0;

void setup() {
  // put your setup code here, to run once:
  pinMode(pin, INPUT);
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Native USB only
  }
  Serial.println("\n");
  mySerial.begin(9600);
  mySerial.println("TX/RX serial connected");
}

void loop() {
  // put your main code here, to run repeatedly:
  double vOut = analogRead(pin);
  //double vOut1 = map(vOut, 0, 1023, 0, 251);
  Serial.println(vOut);
  /*
  if (mySerial.available())
    Serial.write(mySerial.read());
  if (Serial.available())
    mySerial.write(Serial.read());
  */
  mySerial.write(t++);
  mySerial.write(vOut);
}
