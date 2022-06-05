import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { ListadoRecorridosProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Recorrido } from '../domain/Recorrido';
import { mockRecorridos } from '../mocks';
import { styles } from '../styles/styles';

export default function ListadoRecorridos({ navigation }: ListadoRecorridosProps) {
  const renderItem = (recorrido: ListRenderItemInfo<Recorrido>) => (
    <TouchableOpacity
      style={localstyles.item}
      onPress={() => navigation.navigate('DetalleRecorrido', {
        recorrido: recorrido.item,
      })}
    >
      <View style={{ flex: 1 }}>
        <Text style={localstyles.title}>{recorrido.item.nombre}</Text>
        <Text style={localstyles.subtitle}>{recorrido.item.escuela.nombre}</Text>
      </View>
      <View>
        <Text style={localstyles.type}>{recorrido.item.esIda ? 'Ida' : 'Vuelta'}</Text>
        <Text style={localstyles.hour}>{recorrido.item.horario}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={localstyles.list}>
        <FlatList data={mockRecorridos} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Crear Recorrido'} action={() => navigation.navigate('NotFound')}/>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  list: {
    flex: 1,
    margin: 20,
    borderRadius: 8,
  },
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
  type: {
    fontSize: 12,
    textAlign: 'center',
  },
  hour: {
    fontSize: 16,
    textAlign: 'center',
  },
});