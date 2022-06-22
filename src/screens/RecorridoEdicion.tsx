import React, { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { RecorridoEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import CustomSwitch from '../components/form/CustomSwitch';
import { RecorridoFormType } from '../components/form/FormTypes';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import { deleteRecorrido, putRecorrido } from '../services/recorrido.service';
import { mapDateTimeStringToTime } from '../utils/date.utils';

export default function RecorridoEdicion({ route, navigation }: RecorridoEdicionProps) {
  const { recorrido } = route.params;

  const [showModalEliminar, setShowModalEliminar] = useState<boolean>(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  
  const { token } = useContext(AuthContext);
  
  const {control, handleSubmit, formState: {errors}} = useForm<RecorridoFormType>({
    defaultValues: {
      id: recorrido?.id,
      nombre: recorrido?.nombre || '',
      esRecorridoDeIda: recorrido?.esRecorridoDeIda || false,
      horario: recorrido ? mapDateTimeStringToTime(recorrido.horario) : '',
      idPasajeros: recorrido?.pasajeros?.map(p => p.id) || [],
      idEscuela: recorrido?.escuela?.id,
      idChofer: 1,
    }
  });

  const toggleModalEliminar = () => setShowModalEliminar(!showModalEliminar);

  const eliminarRecorrido = async () => {
    toggleModalEliminar();

    try {
      const resp = !!recorrido && await deleteRecorrido(token, recorrido.id);
      if(resp){
        Alert.alert('', `El recorrido ${recorrido?.nombre} fue eliminado con éxito`);
        navigation.navigate('RecorridoListado');
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  const seleccionarEscuela = async (dataRecorrido: RecorridoFormType) => {
    navigation.navigate('EscuelaSeleccion', { dataRecorrido, recorrido });
  };

  const seleccionarPasajeros = async (dataRecorrido: RecorridoFormType) => {
    navigation.navigate('PasajeroSeleccion', { dataRecorrido, recorrido });
  };

  const guardarRecorrido = async (dataRecorrido: RecorridoFormType) => {
    setMensajeError(null);

    try {
      const resp = await putRecorrido(token, dataRecorrido);
      if(resp){
        Alert.alert('', `El recorrido ${dataRecorrido.nombre} fue actualizado con éxito`);
        navigation.navigate('RecorridoListado');
      }
    } catch(error) {
      setMensajeError(error as string);
    }
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
          editable={true}
        />
        <CustomSwitch
          control={control}
          name='esRecorridoDeIda'
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
          editable={true}
        />

        <PrimaryButton name={`${recorrido ? 'Cambiar' : 'Seleccionar'} Escuela`} action={handleSubmit(seleccionarEscuela)} secondary={!!recorrido}/>
        { recorrido && <PrimaryButton name="Cambiar Pasajeros" action={handleSubmit(seleccionarPasajeros)} secondary={true}/> }
        { recorrido && <PrimaryButton name="Eliminar Recorrido" action={toggleModalEliminar} secondary={true}/> }
        { mensajeError && ErrorText(mensajeError) }
        { recorrido && <PrimaryButton name="Guardar Recorrido" action={handleSubmit(guardarRecorrido)} /> }
      </View>

      <ModalConfirmacion
        visible={!!recorrido && showModalEliminar}
        text={`¿Está seguro de eliminar el recorrido ${recorrido?.nombre}?`}
        cancel={toggleModalEliminar}
        confirm={eliminarRecorrido}
      />
    </View>
  );
}
