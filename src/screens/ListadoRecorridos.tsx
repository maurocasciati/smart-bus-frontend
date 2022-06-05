import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { ListadoRecorridosProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { styles } from '../styles/styles';

type Recorrido = {
  id: string,
  escuela: string,
  esIda: boolean,
  horario: string,
  anio: string,
}

export default function ListadoRecorridos({ navigation }: ListadoRecorridosProps) {
  const mockRecorridos: Recorrido[] = [];
  for (let i = 1; i < 15; i++) {
    const esIda = i % 2 == 0;
    mockRecorridos.push({
      id: i.toString(),
      escuela: 'Escuela ' + i.toString(),
      esIda,
      horario: esIda ? '07:00' : '13:00',
      anio: '2022',
    });
  }

  const renderItem = (recorrido: ListRenderItemInfo<Recorrido>) => (
    <TouchableOpacity
      style={localstyles.item}
      onPress={() => navigation.navigate('DetalleRecorrido', {
        recorridoId: recorrido.item.id,
      })}
    >
      <Text style={localstyles.title}>{recorrido.item.escuela}</Text>
      <Text style={localstyles.type}>{recorrido.item.esIda ? 'Ida' : 'Vuelta'}</Text>
      <Text style={localstyles.hour}>{recorrido.item.horario}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList data={mockRecorridos} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'CREAR RECORRIDO'} action={() => navigation.navigate('NotFound')}/>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    flex: 1,
  },
  type: {
    fontSize: 16,
    flex: 2,
    textAlignVertical: 'center',
  },
  hour: {
    fontSize: 24,
    flex: 0.5,
  },
});