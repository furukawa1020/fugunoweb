#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define RELAY_PIN 13
#define SERVICE_UUID        "12345678-1234-1234-1234-123456789012"
#define CHARACTERISTIC_UUID "87654321-4321-4321-4321-210987654321"

BLECharacteristic *pCharacteristic;

void setup() {
    Serial.begin(115200);
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW);

    BLEDevice::init("ESP32_BLE_Control");
    BLEServer *pServer = BLEDevice::createServer();
    BLEService *pService = pServer->createService(SERVICE_UUID);
    pCharacteristic = pService->createCharacteristic(CHARACTERISTIC_UUID,
                        BLECharacteristic::PROPERTY_READ |
                        BLECharacteristic::PROPERTY_WRITE |
                        BLECharacteristic::PROPERTY_NOTIFY);
    pService->start();
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    BLEDevice::startAdvertising();
}

void loop() {
    String value = pCharacteristic->getValue();
    if (value.length() > 0) {
        int duration = value.toInt();
        Serial.print("Received: ");
        Serial.println(duration);

        if (duration > 0) {
            digitalWrite(RELAY_PIN, HIGH); // ソレノイドON（膨張開始）
            delay(duration * 1000);  // 指定された秒数だけ膨張
            digitalWrite(RELAY_PIN, LOW);  // ソレノイドOFF（収縮）
        }
    }
}

