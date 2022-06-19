import React from 'react';
import { View } from 'react-native';
import { EscuelaEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import { EscuelaFormType } from '../components/form/FormTypes';

export default function EscuelaEdicion({ route, navigation }: EscuelaEdicionProps) {
  const { escuela, dataRecorrido, recorrido } = route.params;
  
  const {control, handleSubmit, formState: {errors}} = useForm<EscuelaFormType>({
    defaultValues: {
      nombre: escuela?.nombre || '',
      domicilio: {
        domicilio: escuela?.domicilio || '',
        coordenadas: escuela?.coordenadas || null,
      },
      telefono: escuela?.telefono || '',
    }
  });

  const guardarEscuela = async (dataEscuela: EscuelaFormType) => {
    console.log({ dataEscuela });
    // TODO: Pegarle al back para guardar escuela antes de esto: vvvvv
    alert(`La escuela ${dataEscuela.nombre} fue guardada con éxito`);
    dataRecorrido ? navigation.navigate('EscuelaSeleccion', { dataRecorrido, recorrido: null })
      : recorrido ? navigation.navigate('RecorridoDetalle', { recorrido })
        : navigation.navigate('RecorridoListado');
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
        <CustomTextInput
          control={control}
          name='telefono'
          errors={errors}
          placeholder='Telefono'
          rules={VALIDACIONES.TELEFONO}
        />
        <CustomGoogleAutocomplete
          control={control}
          name='domicilio'
          errors={errors}
          placeholder='Domicilio'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
        />

        <PrimaryButton name="Guardar Escuela" action={handleSubmit(guardarEscuela)} />
      </View>
    </View>
  );
}
