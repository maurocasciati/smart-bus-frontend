import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ActionButton(props: { name: string, secondary?: boolean, action: () => void}) {
  return (
    <TouchableOpacity
      style={{ ...styles.container, backgroundColor: props.secondary ? '#9c9c9c' : 'darkorange'}}
      onPress={props.action}>
      <Text style={styles.text}>{ props.name }</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});