import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { connectToESP32, sendCommand } from './BluetoothService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [stressValue, setStressValue] = useState(50);
  const [stressHistory, setStressHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [inputDuration, setInputDuration] = useState(5); // ユーザーが入力する時間
  const startTimeRef = useRef(Date.now());

  // ストレス値の更新処理
  const handleStressChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setStressValue(value);
  };

  // ユーザー入力の変更処理
  const handleDurationChange = (e) => {
    setInputDuration(parseInt(e.target.value, 10));
  };

  // ESP32に数値を送信
  const handleSend = () => {
    if (characteristic) {
      sendCommand(characteristic, inputDuration);
    } else {
      console.log("⚠️ ESP32に接続されていません！");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">フグ型デバイス ストレスシミュレーター</h1>

      {/* Bluetooth接続ボタン */}
      <div className="mb-4 text-center">
        <button 
          onClick={() => connectToESP32(setDevice, setCharacteristic)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {device ? "ESP32接続済み" : "ESP32と接続"}
        </button>
      </div>

      {/* 送信する膨張時間の入力 */}
      <div className="mb-8 text-center">
        <label htmlFor="duration-input" className="block text-lg mb-2">
          送信する膨張時間 (秒):
        </label>
        <input
          id="duration-input"
          type="number"
          min="1"
          max="30"
          value={inputDuration}
          onChange={handleDurationChange}
          className="w-24 p-2 border rounded text-center"
        />
        <button 
          onClick={handleSend} 
          className="ml-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          送信
        </button>
      </div>

      {/* ストレス値入力 */}
      <div className="mb-8">
        <label htmlFor="stress-input" className="block text-lg mb-2">
          ストレス値を入力 (0-200):
        </label>
        <input
          id="stress-input"
          type="range"
          min="0"
          max="200"
          value={stressValue}
          onChange={handleStressChange}
          className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span>0</span>
          <span>100</span>
          <span>200</span>
        </div>
      </div>
    </div>
  );
}

export default App;

