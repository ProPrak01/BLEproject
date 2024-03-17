// App.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import BLEScanner from './BLEScanner'; 

const App = () => {
  return (
    <View style={styles.container}>
      <BLEScanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
