import React from 'react';
import { Alert, View } from 'react-native';
import { EventualidadAusenciaProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { EventualidadAusenciaFormType } from '../components/form/FormTypes';

export default function EventualidadAusencia({ route, navigation }: EventualidadAusenciaProps) {
  const { pasajero, recorrido } = route.params;
  
  const {control, handleSubmit, formState: {errors}} = useForm<EventualidadAusenciaFormType>({
    defaultValues: {
      desde: '',
      hasta: '',
    }
  });

  const guardarEventualidad = async (dataEventualidad: EventualidadAusenciaFormType) => {
    console.log({ dataEventualidad });
    // TODO: Pegarle al back para guardar eventualidad antes de esto: vvvvv
    Alert.alert('', `Se guardó la ausencia para el pasajero ${pasajero.nombre}`);
    navigation.navigate('PasajeroEdicion', { dataRecorrido: null, recorrido, pasajero });
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <CustomTextInput
          control={control}
          name='desde'
          errors={errors}
          placeholder='Fecha desde'
          rules={VALIDACIONES.FECHA}
          editable={true}
        />
        <CustomTextInput
          control={control}
          name='hasta'
          errors={errors}
          placeholder='Fecha hasta'
          rules={VALIDACIONES.FECHA}
          editable={true}
        />

        <PrimaryButton name="Guardar" action={handleSubmit(guardarEventualidad)} />
      </View>
    </View>
  );
}
