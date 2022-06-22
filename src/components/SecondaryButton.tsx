import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SecondaryButton(props: { name: string, action: (t: any) => void}) {
  return (
    <TouchableOpacity
      style={styles.container}
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
    backgroundColor: '#9c9c9c',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});