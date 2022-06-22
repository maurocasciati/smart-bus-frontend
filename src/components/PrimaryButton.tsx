import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PrimaryButton(props: { name: string, secondary?: boolean, action: (t: any) => void}) {
  return (
    <TouchableOpacity
      style={{
        ...styles.primaryBtn,
        backgroundColor: props.secondary ? '#9c9c9c' : 'darkorange',
        margin: props.secondary ? 4: 15,
      }}
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
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 18,
  },
});