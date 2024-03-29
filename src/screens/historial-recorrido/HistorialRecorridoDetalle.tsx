import React, { useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo } from 'react-native';
import { HistorialRecorridoDetalleProps } from '../../components/Navigation';
import { IrregularidadHistorialRecorrido } from '../../domain/IrregularidadHistorialRecorrido';
import { ParadaHistorialRecorrido } from '../../domain/ParadaHistorialRecorrido';
import { styles } from '../../styles/styles';
import { mapDateTimeStringToDate, mapDateTimeStringToTime, mapDateToDayNumber } from '../../utils/date.utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import ActionButton from '../../components/ActionButton';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getCertificadoHTML } from '../../utils/pdf.utils';
import { AuthContext } from '../../auth/AuthProvider';
import { RolUsuario } from '../../domain/RolUsuario';

export default function HistorialRecorridoDetalle({ route }: HistorialRecorridoDetalleProps) {
  const { historialRecorrido, recorrido } = route.params;

  const { rol } = useContext(AuthContext);

  const renderItem = (paradaItemContainer: ListRenderItemInfo<ParadaHistorialRecorrido>) => (
    <View style={styles.line}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5 }}>
        <View style={{ flex: 12 }}>
          <Text style={styles.title}>{paradaItemContainer.item.nombre} {paradaItemContainer.item.apellido}</Text>
          { !paradaItemContainer.item.exito && 
            <Text style={{ ...styles.subtitle, color: 'darkorange'}}>
              { historialRecorrido.recorrido.esRecorridoDeIda
                ? 'El pasajero no subió al micro'
                : 'El pasajero no bajó en la parada'
              }
            </Text>
          }
        </View>
        <View style={{ flex: 3 }}>
          <Text style={styles.hour}>{mapDateTimeStringToTime(paradaItemContainer.item.fechaParada)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          { paradaItemContainer.item.exito
            ? <Ionicons name='checkmark-circle' size={22} color="darkgreen" />
            : <Ionicons name='alert-circle' size={22} color="darkorange" />
          }
        </View>
      </View>
    </View>
  );

  const renderItemIrregularidad = (paradaItemContainer: ListRenderItemInfo<IrregularidadHistorialRecorrido>) => (
    <View style={styles.line}>
      <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitle}>Mensaje a las {mapDateTimeStringToTime(paradaItemContainer.item.fechaIrregularidad)}:</Text>
        </View>
        <View>
          <Text style={styles.title}>{paradaItemContainer.item.descripcion}</Text>
        </View>
      </View>
    </View>
  );

  const getParadas = () => {
    const idPasajeros: number[] = recorrido.pasajeros.map((p) => p.id);
    return rol?.valueOf() === RolUsuario.TUTOR
      ? historialRecorrido.paradas.filter((p) => idPasajeros.includes(p.idPasajero))
      : historialRecorrido.paradas;
  };

  const terminoTarde = () =>
    rol?.valueOf() === RolUsuario.TUTOR &&
    historialRecorrido.recorrido.esRecorridoDeIda &&
    !historialRecorrido.interrumpido &&
    historialRecorrido.fechaFinalizacion &&
    historialRecorrido.fechaParadaEscuela &&
    mapDateToDayNumber(historialRecorrido.fechaParadaEscuela) > mapDateToDayNumber(historialRecorrido.recorrido.horario);
  
  const imprimirPDF = async () => {
    const { uri } = await Print.printToFileAsync({ html: getCertificadoHTML(recorrido, historialRecorrido) });
    Sharing.shareAsync(uri);
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <View style={styles.detallesRecorrido}>
          { historialRecorrido.interrumpido && <>
            <Text style={{ ...styles.title, color: 'darkorange', textAlign: 'center', paddingBottom: 20}}>
              Este recorrido fue interrumpido por el chofer antes de finalizar
            </Text>
          </>}
          <Text style={styles.subtitle}>Recorrido:</Text>
          <Text style={styles.title}>{historialRecorrido.recorrido?.nombre}</Text>
          <Text style={styles.subtitle}></Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subtitle}>Fecha:</Text>
              <Text style={styles.title}>{mapDateTimeStringToDate(historialRecorrido.fechaInicio)}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.subtitle}>Hora Inicio:</Text>
              <Text style={styles.title}>{mapDateTimeStringToTime(historialRecorrido.fechaInicio)}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.subtitle}>Hora Fin:</Text>
              <Text style={styles.title}>{mapDateTimeStringToTime(historialRecorrido.fechaFinalizacion)}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}></Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
              <Text style={styles.subtitle}>Escuela:</Text>
              <Text style={styles.title}>{historialRecorrido.recorrido.escuela?.nombre}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              { historialRecorrido.fechaParadaEscuela && <>
                <Text style={styles.subtitle}>Hora llegada:</Text>
                <Text style={styles.title}>{mapDateTimeStringToTime(historialRecorrido.fechaParadaEscuela)}</Text>
              </>}
            </View>
          </View>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Paradas:</Text>
        </View>
        <FlatList data={getParadas()} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
        <Text style={styles.subtitle}></Text>
        <View style={styles.detallesRecorridoIrregularidades}>
          <Text style={styles.subtitle}>Irregularidades:</Text>
        </View>
        <FlatList data={historialRecorrido.irregularidades} renderItem={renderItemIrregularidad} keyExtractor={item => item.id.toString()} />
        { terminoTarde() && <>
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subtitle}>Este recorrido llegó tarde a la escuela.</Text>
            </View>
            <View style={{ flex: 1, height: 36 }}>
              <ActionButton name='Certificado' action={imprimirPDF} />
            </View>
          </View>
        </>}
      </SafeAreaView>
    </View>
  );
}
