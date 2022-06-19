import React from 'react';
import { View } from 'react-native';
import { PasajeroEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { PasajeroFormType } from '../components/form/FormTypes';

export default function PasajeroEdicion({ route, navigation }: PasajeroEdicionProps) {
  const { pasajero, dataRecorrido, recorrido } = route.params;
  
  const {control, handleSubmit, formState: {errors}} = useForm<PasajeroFormType>({
    defaultValues: {
      nombre: pasajero?.nombre || '',
      apellido: pasajero?.apellido || '',
      nacimiento: pasajero?.nacimiento || '',
      telefono: pasajero?.telefono || '',
      piso_dpto: pasajero?.piso_dpto || '',
      domicilio: {
        domicilio: pasajero?.domicilio || '',
        coordenadas: pasajero?.coordenadas || null,
      },
    }
  });

  const onSubmit = async (dataPasajero: PasajeroFormType) => {
    console.log({ dataPasajero });
    // TODO: Pegarle al back para guardar pasajero antes de esto: vvvvv

    dataRecorrido ? navigation.navigate('PasajeroSeleccion', { dataRecorrido })
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
          name='apellido'
          errors={errors}
          placeholder='Apellido'
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
        <CustomTextInput
          control={control}
          name='piso_dpto'
          errors={errors}
          placeholder='Piso y departamento'
          rules={{}}
        />

        <PrimaryButton name="Guardar Pasajero" action={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}