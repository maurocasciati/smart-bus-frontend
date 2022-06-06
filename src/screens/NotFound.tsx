import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../styles/styles';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image style={styles.image} source={require('../../assets/favicon.png')}/>
        <Text>404 NOT FOUND</Text>
      </View>
    </View>
  );
}
