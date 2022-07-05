import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../styles/styles';

export default function NotFound(props: { error: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image style={styles.image} source={require('../../assets/orange-error-icon.png')}/>
        <Text>{props.error}</Text>
      </View>
    </View>
  );
}
