import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PrimaryButton(props: { name: string, color?: string, action: (t: any) => void}) {
  return (
    <TouchableOpacity
      style={{ ...styles.primaryBtn, backgroundColor: props.color || 'darkorange'}}
      onPress={props.action}>
      <Text style={styles.primaryBtnText}>{ props.name }</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 18,
  },
});