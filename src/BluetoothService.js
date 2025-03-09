export async function connectToESP32(setDevice, setCharacteristic) {
    try {
        console.log("🔍 スキャン開始...");
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: false,
            filters: [{ name: "ESP32_BLE_Control" }], // ESP32のデバイス名
            optionalServices: ["12345678-1234-1234-1234-123456789012"]
        });

        console.log("✅ デバイス発見:", device.name);
        const server = await device.gatt.connect();
        console.log("🔗 BLE 接続成功！");

        const service = await server.getPrimaryService("12345678-1234-1234-1234-123456789012");
        const characteristic = await service.getCharacteristic("87654321-4321-4321-4321-210987654321");

        setDevice(device);
        setCharacteristic(characteristic);
        console.log("📡 サービス・キャラクタリスティック取得完了！");
    } catch (error) {
        console.error("⚠️ エラー:", error);
    }
}

export async function sendCommand(characteristic, duration) {
    if (!characteristic) {
        console.log("⚠️ まずESP32に接続してください！");
        return;
    }
    
    const command = duration.toString();  // 数値を文字列に変換
    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(command));

    console.log(`📡 ESP32 に送信: ${command} 秒`);
}

