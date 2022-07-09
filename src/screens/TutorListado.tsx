import React from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo } from 'react-native';
import { TutorListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Tutor } from '../domain/Tutor';
import { styles } from '../styles/styles';

export default function TutorListado({ route, navigation }: TutorListadoProps) {
  const { pasajero } = route.params;

  const renderItem = (tutorItem: ListRenderItemInfo<Tutor>) => {
    const esTutorRegistrado = tutorItem.item.nombre || tutorItem.item.apellido;

    return (
      <View style={styles.line}>
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={ {...styles.title, fontStyle: esTutorRegistrado ? 'normal' : 'italic'} }>
              {
                esTutorRegistrado
                  ? tutorItem.item.nombre + ' ' + tutorItem.item.apellido
                  : 'Tutor no registrado'
              }
            </Text>
            <Text style={styles.subtitle}>
              {tutorItem.item.email}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={pasajero.tutores} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Invitar tutores'} action={() => navigation.navigate('TutorInvitacion', { pasajero })}/>
      </View>
    </View>
  );
}
