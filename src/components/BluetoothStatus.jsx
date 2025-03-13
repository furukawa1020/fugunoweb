import React, { useState, useEffect } from 'react';
import { checkConnectionStatus } from '../BluetoothService';

const BluetoothStatus = ({ device }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const status = checkConnectionStatus(device);
            setIsConnected(status);
        }, 2000);

        return () => clearInterval(interval);
    }, [device]);

    return (
        <div>
            <div style={{
                padding: '10px',
                margin: '10px',
                backgroundColor: isConnected ? '#4CAF50' : '#f44336',
                color: 'white',
                borderRadius: '4px'
            }}>
                {isConnected ? '接続中' : '未接続'}
            </div>
        </div>
    );
};

export default BluetoothStatus;