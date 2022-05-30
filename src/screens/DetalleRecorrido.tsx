import React from 'react';
import { View, Text, Button } from 'react-native';
import { DetalleRecorridoProps } from '../components/Navigation';
import { styles } from '../styles/styles';

export default function DetalleRecorrido({ navigation }: DetalleRecorridoProps) {
  return (
    <View style={styles.container}>
      <Text>Pantalla detalle</Text>
      <Button
        title="Volver al inicio"
        onPress={() => navigation.navigate('Inicio')} />
    </View>
  );
}