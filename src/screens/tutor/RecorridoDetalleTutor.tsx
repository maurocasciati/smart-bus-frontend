import { usePubNub } from 'pubnub-react';
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { RecorridoDetalleTutorProps } from '../../components/Navigation';
import PrimaryButton from '../../components/PrimaryButton';
import { Pasajero } from '../../domain/Pasajero';
import { PubNubEvent } from '../../domain/PubNubEvent';
import { styles } from '../../styles/styles';
import { mapDateTimeStringToTime } from '../../utils/date.utils';

export default function RecorridoDetalleTutor({ route, navigation }: RecorridoDetalleTutorProps) {
  const { recorrido } = route.params;

  const [evento, setEvento] = useState<PubNubEvent | null>(null);

  const pubnub = usePubNub();
  const channel = recorrido.id.toString();

  useEffect(() => {
    let isMounted = true;
    (() => {
      if (isMounted) {
        pubnub.fetchMessages(
          {
            channels: [channel],
            count: 1,
          },
          (status, { channels }) => setEvento(channels[channel][0] as PubNubEvent)
        );
      }
    })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    (() => {
      if (isMounted) {
        pubnub.subscribe({ channels: [channel], withPresence: true });
        pubnub.addListener({ message: (event: PubNubEvent) => setEvento(event) });
      }
    })();
    
    return () => { isMounted = false; };
  }, [pubnub]);

  const renderItem = (pasajero: ListRenderItemInfo<Pasajero>) => 
  // TODO: Eliminar linea de abajo cuando este el filtro de getRecorridos
    pasajero.item.id != 2 ? <></> : 
      (
        <View style={styles.line}>
          <TouchableOpacity
            style={styles.itemsmall}
            onPress={() => navigation.navigate('PasajeroDetalleTutor', {
              pasajero: pasajero.item, recorrido
            })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{pasajero.item.nombre} {pasajero.item.apellido}</Text>
              <Text style={styles.subtitle}>{pasajero.item.domicilio.domicilio}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <View style={styles.detallesRecorrido}>
          <Text style={styles.subtitle}>Escuela:</Text>
          <Text style={styles.title}>{recorrido.escuela?.nombre}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Dirección:</Text>
          <Text style={styles.title}>{recorrido.escuela?.direccion.domicilio}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Horario:</Text>
          <Text style={styles.title}>{mapDateTimeStringToTime(recorrido.horario)} {recorrido.esRecorridoDeIda ? '(Ida)' : '(Vuelta)'}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Chofer:</Text>
          <Text style={styles.title}>{recorrido.chofer.nombre} {recorrido.chofer.apellido}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Pasajeros:</Text>
        </View>
        <FlatList data={recorrido.pasajeros} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Ver historial del recorrido'} action={() => null} secondary= {true}/>
        { evento?.message.enCurso
          ? <PrimaryButton name={'Ver recorrido en curso'} action={() => navigation.navigate('RecorridoEnCursoTutor', { recorrido, eventoRecorrido: evento })} />
          : <View style={{ padding: 20 }}></View>
        }
      </View>
    </View>
  );
}
