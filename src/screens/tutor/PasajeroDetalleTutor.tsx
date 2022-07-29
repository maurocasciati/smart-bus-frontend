import React from 'react';
import { View } from 'react-native';
import { styles } from '../../styles/styles';
import PrimaryButton from '../../components/PrimaryButton';
import DoubleButton from '../../components/DobleButton';
import CustomText from '../../components/form/CustomText';
import { PasajeroDetalleTutorProps } from '../../components/Navigation';
import { mapDateTimeStringToYear } from '../../utils/date.utils';

export default function PasajeroDetalleTutor({ route, navigation }: PasajeroDetalleTutorProps) {
  const { pasajero, recorrido } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <CustomText value={pasajero.nombre}/>
        <CustomText value={pasajero.apellido}/>
        <CustomText value={mapDateTimeStringToYear(pasajero.fechaNacimiento)}/>
        <CustomText value={pasajero.telefono}/>
        <CustomText value={pasajero.domicilio.domicilio}/>
        { !!pasajero.pisoDepartamento && <CustomText value={pasajero.pisoDepartamento}/> }
        
        { recorrido &&
        <>
          <DoubleButton
            name1="Establecer ausencia"
            action1={() => recorrido && navigation.navigate('EventualidadAusencia', { recorrido, pasajero })}
            secondary1={true}
            name2="Establecer domicilio temp."
            action2={() => recorrido && navigation.navigate('EventualidadDomicilio', { recorrido, pasajero })}
            secondary2={true} />
          <PrimaryButton name="Ver estado de cuenta" action={() => navigation.navigate('EstadoDeCuenta', { pasajero, recorrido })} />
        </>
        }
      </View>
    </View>
  );
}