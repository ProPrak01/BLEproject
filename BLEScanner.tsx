import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, View, Text, Button, FlatList, NativeEventEmitter } from 'react-native';
import { BleManager,Device } from 'react-native-ble-plx';
import { NativeModules } from 'react-native';

const BLEScanner = () => {


const manager = new BleManager();
const eventEmitter = new NativeEventEmitter(NativeModules.BleManager);
        const [devices, setDevices] = useState<Device[]>([]);
            const [scanning, setScanning] = useState(false);
            const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    let bleManager = new BleManager();

    useEffect(() => {
        requestBluetoothPermission();

        return () => {
            stopScan();
            bleManager.destroy();
        };
    }, []);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] !== 'granted' ||
        granted['android.permission.BLUETOOTH_SCAN'] !== 'granted' ||
        granted['android.permission.BLUETOOTH_CONNECT'] !== 'granted'
      ) {
        console.error('Required permissions not granted!');
      }
    }
  };

  const startScan = () => {
    setScanning(true);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning:', error);
        return;
      }
      if (device) {
        setDevices(prevDevices => [...prevDevices, device]);
      }
    });
  };

  const stopScan = () => {
    setScanning(false);
    bleManager.stopDeviceScan();
  };

const connectToDevice = async (device: Device) => {
    try {
        await device.connect();
        setConnectedDevice(device);
    } catch (error) {
        console.error('Error connecting to device:', error);
    }
};

const renderDeviceItem = ({ item }: { item: Device }) => (
    <View style={{ padding: 10 }}>
        <Text>{item.name || 'Unnamed Device'}</Text>
        <Text>{item.id}</Text>
        <Text>{item.rssi}</Text>
        <Button
  title="Connect"
  disabled={!!(connectedDevice && connectedDevice.id === item.id)}
  onPress={() => connectToDevice(item)}
/>
    </View>
);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={scanning ? 'Stop Scanning' : 'Start Scanning'}
        onPress={() => (scanning ? stopScan() : startScan())}
      />
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default BLEScanner;
