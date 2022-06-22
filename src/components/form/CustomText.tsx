import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/styles';

export default function CustomText({ value }: { value: string }) {
  return (
    <View style={styles.inputView}>
      <Text
        style={styles.textInput}
        ellipsizeMode={'tail'}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}