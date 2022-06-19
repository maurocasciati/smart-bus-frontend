import React, { useState } from 'react';
import { FlatList, SafeAreaView, View, Text, StyleSheet, ListRenderItemInfo, TouchableOpacity, TextInput } from 'react-native';
import Checkbox from 'expo-checkbox';
import { PasajeroSeleccionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { pasajerosMock } from '../mocks';
import PrimaryButton from '../components/PrimaryButton';
import ErrorText from '../components/ErrorText';
import { Pasajero } from '../domain/Pasajero';

export default function PasajeroSeleccion({ route, navigation }: PasajeroSeleccionProps) {
  const { dataRecorrido } = route.params;
  const [idPasajeros, setIdPasajeros] = useState<string[]>([]);
  const [listadoPasajeros, setListadoPasajeros] = useState<Pasajero[]>(pasajerosMock);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const filtrarPasajeros = (texto: string) => {
    setListadoPasajeros(pasajerosMock.filter((escuela) => escuela.nombre.toLowerCase().includes(texto.toLowerCase()) || escuela.apellido.toLowerCase().includes(texto.toLowerCase())));
  };

  const finalizar = () => {
    idPasajeros.length > 0
      ? guardarRecorrido()
      : setMensajeError('No se han seleccionado pasajeros.');
  };

  const guardarRecorrido = () => {
    dataRecorrido.idPasajeros = idPasajeros;
    console.log(dataRecorrido);
    alert(`El recorrido ${dataRecorrido.nombre} fue creado con éxito`);
    navigation.navigate('RecorridoListado');
  };

  const clickearPasajero = (id: string) => {
    idPasajeros.includes(id)
      ? setIdPasajeros(idPasajeros.filter(pid => pid != id))
      : setIdPasajeros([...idPasajeros, id]);
  };

  const renderItem = (pasajero: ListRenderItemInfo<Pasajero>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => clickearPasajero(pasajero.item.id)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {pasajero.item.nombre} {pasajero.item.apellido}
          </Text>
          <Text style={styles.subtitle}>
            {pasajero.item.domicilio}
          </Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Checkbox 
            value={idPasajeros.includes(pasajero.item.id)}
            color={'orange'}/>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={localstyles.header}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder='Buscar'
            onChangeText={filtrarPasajeros}
          />
        </View>
      </View>

      <SafeAreaView style={styles.list}>
        <FlatList data={listadoPasajeros} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>
      
      <View style={localstyles.footer}>
        <PrimaryButton name={'Crear nuevo Pasajero'} action={() => []}/>
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Guardar Recorrido'} action={finalizar}/>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: -30,
  },
  footer: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 20,
  },
});
