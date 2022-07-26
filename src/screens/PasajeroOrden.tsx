import React, { useContext, useRef, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity, StyleSheet, PanResponderInstance, Animated, PanResponder, Alert } from 'react-native';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import { RecorridoFormType } from '../components/form/FormTypes';
import { PasajeroListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Pasajero } from '../domain/Pasajero';
import { putRecorrido } from '../services/recorrido.service';
import { styles } from '../styles/styles';
import { mapDateTimeStringToTime } from '../utils/date.utils';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PasajeroOrden({ route, navigation }: PasajeroListadoProps) {
  const { recorrido } = route.params;

  const [listadoPasajeros, setListadoPasajeros] = useState<Pasajero[]>(recorrido.pasajeros);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  
  const [draggingIndex, setDraggingIndex] = useState<number>(-1);
  
  const { token } = useContext(AuthContext);

  const pan = useRef(new Animated.ValueXY()).current;

  let scrollOffset = 0;
  let flatlistTopOffset = 0;
  const rowHeight = 60;

  const yToIndex = (y: number) => {
    const value = Math.floor(
      (scrollOffset + y - flatlistTopOffset) / rowHeight
    );

    if (value < 0) {
      return 0;
    }

    if (value > listadoPasajeros.length - 1) {
      return listadoPasajeros.length - 1;
    }

    return value;
  };

  const immutableMove = (arr: Pasajero[], from: number, to: number) => {
    const element = arr.splice(from, 1)[0];
    arr.splice(to, 0, element);
    return arr;
  };

  const reset = () => {
    setDragging(false);
    setDraggingIndex(-1);
  };

  const _panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: () => reset(),
    onPanResponderTerminate: () => reset(),
    onShouldBlockNativeResponder: () => true,

    onPanResponderGrant: (evt, gestureState) => {
      Animated.event([null, { y: pan.y }], {useNativeDriver: false})(null, { y: gestureState.y0 - 130 });
      setDraggingIndex(yToIndex(gestureState.y0 - 130));
      setDragging(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, { y: pan.y }], {useNativeDriver: false})(null, { y: gestureState.moveY - 130 });
      const newIdx = yToIndex(gestureState.moveY - 130);

      if (draggingIndex >= 0 && draggingIndex !== newIdx) {
        setListadoPasajeros(immutableMove(listadoPasajeros, draggingIndex, newIdx));
        setDraggingIndex(newIdx);
      }
    },
  });

  const guardarCambios = async () => {
    const data =  {
      id: recorrido.id,
      nombre: recorrido.nombre,
      esRecorridoDeIda: recorrido.esRecorridoDeIda,
      horario: mapDateTimeStringToTime(recorrido.horario),
      idPasajeros: listadoPasajeros.map((p) => p.id),
      idEscuela: recorrido.escuela?.id,
      idChofer: recorrido.chofer.id,
    } as RecorridoFormType;

    setMensajeError(null);

    try {
      const resp = await putRecorrido(token, data);
      if(resp){
        Alert.alert('', `Se guardó el orden de pasajeros del recorrido ${data.nombre}`);
        navigation.navigate('PasajeroListado', { recorrido: resp });
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };


  const renderItem = (pasajeroItem: ListRenderItemInfo<Pasajero>, noPanResponder = false) => (
    <View style={localstyles.line} {...(noPanResponder ? {} : _panResponder.panHandlers)}>
      <View style={localstyles.item}>
        <View style={{ flex: 8, display: draggingIndex == pasajeroItem.index ? 'none' : 'flex' }}>
          <Text style={{ fontSize: 18 }}>
            {pasajeroItem.item.nombre + ' ' + pasajeroItem.item.apellido}
          </Text>
          <Text style={{ fontSize: 14 }} numberOfLines={1} ellipsizeMode='tail'>
            {pasajeroItem.item.domicilio.domicilio}
          </Text>
        </View>
        <View style={{ flex: 1, display: draggingIndex == pasajeroItem.index ? 'none' : 'flex' }}>
          <Ionicons name='reorder-three-sharp' size={48} color="darkorange" />
        </View>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        { dragging &&
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              zIndex: 2, 
              width: '100%',
              borderRadius: 30,
              top: pan.getLayout().top
            }}
          >
            {renderItem({ item: listadoPasajeros[draggingIndex] } as ListRenderItemInfo<Pasajero>, true)}
          </Animated.View>
        }
        <FlatList
          scrollEnabled={!dragging}
          data={listadoPasajeros}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onScroll={(e) => scrollOffset = e.nativeEvent.contentOffset.y}
          onLayout={(e) => flatlistTopOffset = e.nativeEvent.layout.y}
        />
      </SafeAreaView>

      <View style={styles.center}>
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Guardar orden'} action={guardarCambios}/>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 20,
    paddingVertical: 5,
    height: 60,
    borderRadius: 30,
  },
  line: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
});
