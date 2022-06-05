import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/styles';

export default function PrimaryButton(props: { name: string, action: (t: any) => void}) {
  return (
    <TouchableOpacity
      style={styles.primaryBtn}
      onPress={props.action}>
      <Text style={styles.primaryBtnText}>{ props.name }</Text>
    </TouchableOpacity>
  );
}