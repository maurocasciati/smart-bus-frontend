import React, { useState } from 'react';
import { FlatList, SafeAreaView, View, Text, ListRenderItemInfo, TouchableOpacity, TextInput } from 'react-native';
import Checkbox from 'expo-checkbox';
import { PasajeroSeleccionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { pasajerosMock } from '../mocks';
import PrimaryButton from '../components/PrimaryButton';
import ErrorText from '../components/ErrorText';
import { Pasajero } from '../domain/Pasajero';

export default function PasajeroSeleccion({ route, navigation }: PasajeroSeleccionProps) {
  const { dataRecorrido, recorrido } = route.params;
  const [idPasajeros, setIdPasajeros] = useState<string[]>(recorrido?.pasajeros?.map(p => p.id) || []);
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
    alert(`El recorrido ${dataRecorrido.nombre} fue guardado con éxito`);
    navigation.navigate('RecorridoListado');
  };

  const clickearPasajero = (id: string) => {
    idPasajeros.includes(id)
      ? setIdPasajeros(idPasajeros.filter(pid => pid != id))
      : setIdPasajeros([...idPasajeros, id]);
  };

  const crearPasajero = () => {
    navigation.navigate('PasajeroEdicion', { dataRecorrido, pasajero: null, recorrido: null });
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
      <View style={styles.header}>
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
      
      <View style={styles.footer}>
        <PrimaryButton name={'Crear nuevo Pasajero'} action={crearPasajero} secondary={true}/>
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Guardar Recorrido'} action={finalizar}/>
      </View>
    </View>
  );
}
