import React from 'react';
import { View, Text, Button } from 'react-native';
import { ListadoRecorridosProps } from '../components/Navigation';
import { styles } from '../styles/styles';

export default function ListadoRecorridos({ navigation }: ListadoRecorridosProps) {
  return (
    <View style={styles.container}>
      <Text>Listado completo de recorridos</Text>
      <Button
        title="Ver recorrido"
        onPress={() => navigation.navigate('DetalleRecorrido', {
          recorridoId: 1,
        })} />
    </View>
  );
}