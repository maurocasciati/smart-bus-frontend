import React from 'react';
import { View } from 'react-native';
import { RecorridoEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import CustomSwitch from '../components/form/CustomSwitch';
import { RecorridoFormType } from '../components/form/FormTypes';

export default function RecorridoEdicion({ route, navigation }: RecorridoEdicionProps) {
  const { recorrido } = route.params;
  
  const {control, handleSubmit, formState: {errors}, reset} = useForm<RecorridoFormType>({
    defaultValues: {
      nombre: recorrido?.nombre || '',
      esIda: recorrido?.esIda || false,
      horario: recorrido?.horario || '',
      idPasajeros: [],
      idEscuela: undefined,
    }
  });

  const onSubmit = async (dataRecorrido: RecorridoFormType) => {
    navigation.navigate('EscuelaSeleccion', { dataRecorrido });
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <CustomTextInput
          control={control}
          name='nombre'
          errors={errors}
          placeholder='Nombre'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
        />
        <CustomSwitch
          control={control}
          name='esIda'
          errors={errors}
          placeholderTrue='Ida'
          placeholderFalse='Vuelta'
        />
        <CustomTextInput
          control={control}
          name='hora'
          errors={errors}
          placeholder='Horario (HH:MM)'
          rules={VALIDACIONES.HORARIO}
        />

        <PrimaryButton name="Seleccionar Escuela" action={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}
