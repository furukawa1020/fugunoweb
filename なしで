#include <WiFi.h>
#include <HTTPClient.h>

// ----- WiFi設定 -----
const char* ssid = "ambicion";
const char* password = "abbcccdddd";

// ----- Webサーバ設定 -----
// このURLには、テキスト形式で通常動作時間（秒数）が送信されるものとします。
const char* serverName = "http://yourwebsite.com/operation_time.txt";

// ----- 動作サイクル設定 -----
#define UPDATE_INTERVAL 30000   // 更新周期 30秒（30000ms）

// ----- メンテナンスモード設定 -----
// メンテナンスモードは10秒ON／10秒OFFのサイクルで動作する
#define MAINTENANCE_ON_DURATION 10000   // 10秒ON (ms)
#define MAINTENANCE_OFF_DURATION 10000  // 10秒OFF (ms)

// ----- リレー制御ピン -----
#define RELAY_PIN 14

// ----- 初期動作（例：80秒間の通常動作） -----
// ここでは初期状態で目標状態に到達させるため、80秒間リレーONにします。
#define INITIAL_OPERATION_DURATION 80000  // 80秒 (ms)

// ----- 通常動作関数 ----- 
// 指定時間（ms）だけリレーをONにする
void normalOperation(unsigned long durationMs) {
  Serial.print("Normal operation for ");
  Serial.print(durationMs / 1000.0);
  Serial.println(" seconds.");
  digitalWrite(RELAY_PIN, HIGH);
  delay(durationMs);
  digitalWrite(RELAY_PIN, LOW);
  Serial.println("Normal operation complete.");
}

// ----- メンテナンスモード関数 ----- 
// 指定時間（ms）分、10秒ON／10秒OFFのサイクルを繰り返す
void maintenanceMode(unsigned long durationMs) {
  Serial.println("Entering maintenance mode...");
  unsigned long startTime = millis();
  while (millis() - startTime < durationMs) {
    digitalWrite(RELAY_PIN, HIGH);
    delay(MAINTENANCE_ON_DURATION);
    digitalWrite(RELAY_PIN, LOW);
    delay(MAINTENANCE_OFF_DURATION);
  }
  Serial.println("Exiting maintenance mode...");
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  // WiFi接続
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected");

  // 初期動作：目標状態に到達するため、80秒間リレーON
  Serial.println("Initial operation to reach target state (80 sec)...");
  digitalWrite(RELAY_PIN, HIGH);
  delay(INITIAL_OPERATION_DURATION);
  digitalWrite(RELAY_PIN, LOW);
  Serial.println("Initial operation complete.");
}

void loop() {
  float normalTime = 0.0;  // Webから受信した通常動作時間（秒）

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    int httpCode = http.GET();
    if (httpCode > 0) {
      String payload = http.getString();
      normalTime = payload.toFloat();  // 受信したテキストを数値に変換
      Serial.print("Received normal operation time: ");
      Serial.print(normalTime);
      Serial.println(" sec");
    } else {
      Serial.print("HTTP GET error: ");
      Serial.println(httpCode);
    }
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
  
  // 受信した値が負の場合は0に
  if(normalTime < 0) {
    normalTime = 0;
  }
  
  // 更新周期は固定 30秒（UPDATE_INTERVAL）
  // 通常動作時間として受信値そのままを使用（下限・上限は撤廃）
  unsigned long normalDurationMs = (unsigned long)(normalTime * 1000);
  
  // メンテナンスモードの時間は、更新周期内の残り時間（もしあれば）
  unsigned long maintenanceDurationMs = 0;
  if(normalDurationMs < UPDATE_INTERVAL) {
    maintenanceDurationMs = UPDATE_INTERVAL - normalDurationMs;
  } else {
    normalDurationMs = UPDATE_INTERVAL;  // もし受信値が30秒以上なら通常動作は更新周期分のみ
    maintenanceDurationMs = 0;
  }
  
  Serial.print("Normal operation duration: ");
  Serial.print(normalDurationMs / 1000.0);
  Serial.println(" sec");
  Serial.print("Maintenance mode duration: ");
  Serial.print(maintenanceDurationMs / 1000.0);
  Serial.println(" sec");
  
  // 通常動作
  normalOperation(normalDurationMs);
  
  // 残りの時間をメンテナンスモードで実施（受信値が更新周期未満の場合）
  if (maintenanceDurationMs > 0) {
    maintenanceMode(maintenanceDurationMs);
  }
  
  // 次の更新周期までループ（更新周期は固定30秒）
  // ※ 通常動作＋メンテナンスモードの合計がUPDATE_INTERVALになるため、delayは不要
}
