import React from 'react';
import { Alert, View } from 'react-native';
import { EventualidadDomicilioProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { EventualidadDomicilioFormType } from '../components/form/FormTypes';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';

export default function EventualidadDomicilio({ route, navigation }: EventualidadDomicilioProps) {
  const { pasajero, recorrido } = route.params;
  
  const {control, handleSubmit, formState: {errors}} = useForm<EventualidadDomicilioFormType>({
    defaultValues: {
      desde: '',
      hasta: '',
      domicilio: null,
    }
  });

  const guardarEventualidad = async (dataEventualidad: EventualidadDomicilioFormType) => {
    console.log({ dataEventualidad });
    // TODO: Pegarle al back para guardar eventualidad antes de esto: vvvvv
    Alert.alert('', `Se guardó el cambio de domicilio temporal para el pasajero ${pasajero.nombre}`);
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
        <CustomGoogleAutocomplete
          control={control}
          name='domicilio'
          errors={errors}
          placeholder='Domicilio temporal'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
        />

        <PrimaryButton name="Guardar" action={handleSubmit(guardarEventualidad)} />
      </View>
    </View>
  );
}
