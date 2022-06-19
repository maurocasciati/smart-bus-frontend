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
  
  const {control, handleSubmit, formState: {errors}} = useForm<RecorridoFormType>({
    defaultValues: {
      nombre: recorrido?.nombre || '',
      esIda: recorrido?.esIda || false,
      horario: recorrido?.horario || '',
      idPasajeros: recorrido?.pasajeros?.map(p => p.id) || [],
      idEscuela: recorrido?.escuela?.id,
    }
  });

  const seleccionarEscuela = async (dataRecorrido: RecorridoFormType) => {
    navigation.navigate('EscuelaSeleccion', { dataRecorrido, recorrido });
  };

  const seleccionarPasajeros = async (dataRecorrido: RecorridoFormType) => {
    navigation.navigate('PasajeroSeleccion', { dataRecorrido, recorrido });
  };

  const guardarRecorrido = async (dataRecorrido: RecorridoFormType) => {
    console.log({dataRecorrido});
    // TODO pegarle al back directo y guardar el recorrido solo con cambios de texto
    alert(`El recorrido ${dataRecorrido.nombre} fue actualizado con éxito`);
    navigation.navigate('RecorridoListado');
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
          name='horario'
          errors={errors}
          placeholder='Horario (HH:MM)'
          rules={VALIDACIONES.HORARIO}
        />

        <PrimaryButton name={`${recorrido ? 'Cambiar' : 'Seleccionar'} Escuela`} action={handleSubmit(seleccionarEscuela)} secondary={!!recorrido}/>
        { recorrido && <PrimaryButton name="Cambiar Pasajeros" action={handleSubmit(seleccionarPasajeros)} secondary={true}/> }
        { recorrido && <PrimaryButton name="Guardar Recorrido" action={handleSubmit(guardarRecorrido)} /> }
      </View>
    </View>
  );
}
