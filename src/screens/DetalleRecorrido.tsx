import React from 'react';
import { View, Text, Button } from 'react-native';
import { DetalleRecorridoProps } from '../components/Navigation';
import { styles } from '../styles/styles';

export default function DetalleRecorrido({ route, navigation }: DetalleRecorridoProps) {
  const { recorridoId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Pantalla detalle de Recorrido: {recorridoId}</Text>
      <Button
        title="Volver a inicio"
        onPress={() => navigation.navigate('Inicio')} />
    </View>
  );
}