import React from 'react';
import { View, Text, Button } from 'react-native';
import { InicioProps } from '../components/Navigation';
import { styles } from '../styles/styles';

export default function HomeScreen({ navigation }: InicioProps) {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button
        title="Ver listado de recorridos"
        onPress={() => navigation.navigate('ListadoRecorridos')} />
    </View>
  );
}
