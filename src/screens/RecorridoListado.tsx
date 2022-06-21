import React from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { RecorridoListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Recorrido } from '../domain/Recorrido';
import { mockRecorridos } from '../mocks';
import { styles } from '../styles/styles';

export default function RecorridoListado({ navigation }: RecorridoListadoProps) {
  const renderItem = (recorrido: ListRenderItemInfo<Recorrido>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('RecorridoDetalle', {
          recorrido: recorrido.item,
        })}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{recorrido.item.nombre}</Text>
          <Text style={styles.subtitle}>{recorrido.item.escuela.nombre}</Text>
        </View>
        <View>
          <Text style={styles.type}>{recorrido.item.esIda ? 'Ida' : 'Vuelta'}</Text>
          <Text style={styles.hour}>{recorrido.item.horario}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={mockRecorridos} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Crear Recorrido'} action={() => navigation.navigate('RecorridoEdicion', { recorrido: null } )}/>
      </View>
    </View>
  );
}
