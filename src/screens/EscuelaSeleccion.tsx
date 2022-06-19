import React, { useState } from 'react';
import { FlatList, SafeAreaView, View, Text, StyleSheet, ListRenderItemInfo, TouchableOpacity, TextInput } from 'react-native';
import Checkbox from 'expo-checkbox';
import { EscuelaSeleccionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { Escuela } from '../domain/Escuela';
import { escuelasMock } from '../mocks';
import PrimaryButton from '../components/PrimaryButton';
import ErrorText from '../components/ErrorText';

export default function EscuelaSeleccion({ route, navigation }: EscuelaSeleccionProps) {
  const { dataRecorrido } = route.params;
  const [idEscuela, setIdEscuela] = useState<string | null>(null);
  const [listadoEscuelas, setListadoEscuelas] = useState<Escuela[]>(escuelasMock);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const filtrarEscuela = (nombre: string) => {
    setListadoEscuelas(escuelasMock.filter((escuela) => escuela.nombre.toLowerCase().includes(nombre.toLowerCase())));
  };

  const seleccionarEscuela = (id: string) => {
    setMensajeError(null);
    setIdEscuela(id);
  };

  const crearEscuela = () => {
    navigation.navigate('EscuelaEdicion', { dataRecorrido, escuela: null, recorrido: null });
  };

  const siguiente = () => {
    idEscuela
      ? navigation.navigate('PasajeroSeleccion', { dataRecorrido: { ...dataRecorrido, idEscuela }})
      : setMensajeError('Debe seleccionar una escuela del listado.');
  };

  const renderItem = (escuela: ListRenderItemInfo<Escuela>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => seleccionarEscuela(escuela.item.id)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {escuela.item.nombre}
          </Text>
          <Text style={styles.subtitle}>
            {escuela.item.domicilio}
          </Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Checkbox 
            value={idEscuela === escuela.item.id}
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
            onChangeText={filtrarEscuela}
          />
        </View>
      </View>

      <SafeAreaView style={styles.list}>
        <FlatList data={listadoEscuelas} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>
      
      <View style={localstyles.footer}>
        <PrimaryButton name={'Crear nueva Escuela'} action={crearEscuela} color={'#9c9c9c'}/>
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Seleccionar Pasajeros'} action={siguiente}/>
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
