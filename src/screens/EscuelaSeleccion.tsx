import React, { useState } from 'react';
import { FlatList, SafeAreaView, View, Text, StyleSheet, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { EscuelaSeleccionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { Escuela } from '../domain/Escuela';
import { escuelasMock } from '../mocks';
import PrimaryButton from '../components/PrimaryButton';

export default function EscuelaSeleccion({ route, navigation }: EscuelaSeleccionProps) {
  const { dataRecorrido } = route.params;
  const [ idEscuela, setIdEscuela] = useState<string | null>(null);

  const renderItem = (escuela: ListRenderItemInfo<Escuela>) => (
    <TouchableOpacity
      style={localstyles.item}
      onPress={() => setIdEscuela(escuela.item.id)}
    >
      <View style={{ flex: 1 }}>
        <Text style={localstyles.title}>
          {escuela.item.nombre}
        </Text>
        <Text style={localstyles.subtitle}>
          {escuela.item.domicilio}
        </Text>
      </View>
      <View style={{ alignSelf: 'center' }}>
        <Checkbox 
          value={idEscuela === escuela.item.id}
          color={'orange'}/>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={escuelasMock} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>
      
      <View style={styles.center}>
        <PrimaryButton name={'Crear nueva Escuela'} action={() => []}/>
        <PrimaryButton name={'Seleccionar Pasajeros'} action={() => []}/>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    alignContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    alignContent: 'center',
  },
});
