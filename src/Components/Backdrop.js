import React from 'react';
import { View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

const heightMobile = Dimensions.get('screen').height;

export const Backdrop = ({ visible, onPress }) => {
  return visible && <View style={styles.overlay} onPress={onPress} />;
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: heightMobile,
    position: 'absolute',
    width: '100%',
    zIndex: 1000
  }
});
