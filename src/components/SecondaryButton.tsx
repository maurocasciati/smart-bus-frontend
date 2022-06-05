import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SecondaryButton(props: { name: string, action: (t: any) => void}) {
  return (
    <TouchableOpacity
      style={styles.primaryBtn}
      onPress={props.action}>
      <Text style={styles.primaryBtnText}>{ props.name }</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    borderRadius: 25,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'peachpuff',
  },
  primaryBtnText: {
    color: 'darkgray',
    fontSize: 16,
  },
});