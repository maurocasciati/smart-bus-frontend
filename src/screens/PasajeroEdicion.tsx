import React, { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { PasajeroEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { PasajeroFormType } from '../components/form/FormTypes';
import DoubleButton from '../components/DobleButton';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import { deletePasajero, postPasajero, putPasajero } from '../services/pasajero.service';
import { mapDateTimeStringToYear } from '../utils/date.utils';
import CustomText from '../components/form/CustomText';
import { Recorrido } from '../domain/Recorrido';
import { Pasajero } from '../domain/Pasajero';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function PasajeroEdicion({ route, navigation }: PasajeroEdicionProps) {
  const { pasajero, dataRecorrido, recorrido } = route.params;

  const [showModalEliminar, setShowModalEliminar] = useState<boolean>(false);
  const [modoEdicion, setModoEdicion] = useState<boolean>(!pasajero);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);
  
  const {control, handleSubmit, formState: {errors}} = useForm<PasajeroFormType>({
    defaultValues: {
      id: pasajero?.id,
      nombre: pasajero?.nombre || '',
      apellido: pasajero?.apellido || '',
      fechaNacimiento: pasajero ? mapDateTimeStringToYear(pasajero.fechaNacimiento) : '',
      telefono: pasajero?.telefono || '',
      pisoDepartamento: pasajero?.pisoDepartamento || '',
      domicilio: pasajero?.domicilio ? {
        domicilio: pasajero?.domicilio.domicilio || '',
        coordenadas: pasajero?.domicilio.coordenadas || null,
      } : null,
    }
  });

  const toggleModalEliminar = () => setShowModalEliminar(!showModalEliminar);

  const eliminarPasajero = async () => {
    toggleModalEliminar();

    try {
      const resp = !!pasajero && await deletePasajero(token, pasajero.id);
      if(resp){
        Alert.alert('', `El pasajero ${pasajero.nombre} ${pasajero.apellido} fue eliminado con éxito`);
        recorrido ? navigation.navigate('RecorridoDetalle', { recorrido: getRecorridoActualizado(recorrido, resp) })
          : navigation.navigate('RecorridoListado');
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  const getRecorridoActualizado = (recorrido: Recorrido, nuevoPasajero: Pasajero) => {
    return {
      ...recorrido,
      pasajeros: recorrido.pasajeros.filter(p => p.id != nuevoPasajero.id).concat(nuevoPasajero),
    } as Recorrido;
  };

  const guardarPasajero = async (dataPasajero: PasajeroFormType) => {
    setMensajeError(null);

    try {
      const resp = recorrido
        ? await putPasajero(token, dataPasajero)
        : await postPasajero(token, dataPasajero);
      if(resp){
        Alert.alert('', `El pasajero ${dataPasajero.nombre} ${dataPasajero.apellido} fue guardado con éxito`);
        dataRecorrido ? navigation.navigate('PasajeroSeleccion', { dataRecorrido, recorrido })
          : recorrido ? navigation.navigate('RecorridoDetalle', { recorrido: getRecorridoActualizado(recorrido, resp) })
            : navigation.navigate('RecorridoListado');
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
          editable={modoEdicion}
        />
        <CustomTextInput
          control={control}
          name='apellido'
          errors={errors}
          placeholder='Apellido'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
          editable={modoEdicion}
        />
        <CustomTextInput
          control={control}
          name='fechaNacimiento'
          errors={errors}
          placeholder='Nacimiento'
          rules={VALIDACIONES.FECHA}
          editable={modoEdicion}
        />
        <CustomTextInput
          control={control}
          name='telefono'
          errors={errors}
          placeholder='Telefono'
          rules={VALIDACIONES.TELEFONO}
          editable={modoEdicion}
        />
        { pasajero && <CustomText value={pasajero.domicilio.domicilio}/> }
        { modoEdicion &&
          <CustomGoogleAutocomplete
            control={control}
            name='domicilio'
            errors={errors}
            placeholder={pasajero ? 'Editar domicilio' : 'Domicilio'}
            rules={VALIDACIONES.TEXTO_NO_VACIO}
          />
        }
        <CustomTextInput
          control={control}
          name='pisoDepartamento'
          errors={errors}
          placeholder='Piso y departamento'
          rules={{}}
          editable={modoEdicion}
        />

        { mensajeError && ErrorText(mensajeError) }
        { modoEdicion
          ? 
          <>
            { pasajero && <PrimaryButton name="Eliminar Pasajero" action={toggleModalEliminar} secondary={true} /> }
            <PrimaryButton name="Guardar Pasajero" action={handleSubmit(guardarPasajero)} />
          </>
          :
          <>
            <PrimaryButton 
              name="Ver estado de cuenta"
              action={() => recorrido && pasajero && navigation.navigate('EstadoDeCuenta', { pasajero, recorrido })} secondary={true} />
            <DoubleButton 
              name1="Establecer ausencia"
              action1={() => recorrido && pasajero && navigation.navigate('EventualidadAusencia', { recorrido, pasajero })}
              secondary1={true}
              name2="Establecer cambio de domicilio"
              action2={() => recorrido && pasajero && navigation.navigate('EventualidadDomicilio', { recorrido, pasajero })}
              secondary2={true} />
            <PrimaryButton name="Editar Pasajero" action={() => setModoEdicion(true)} />
          </>
        }
      </View>

      <ModalConfirmacion
        visible={!!pasajero && showModalEliminar}
        text={`¿Está seguro de eliminar el pasajero ${pasajero?.nombre} ${pasajero?.apellido}?`}
        cancel={toggleModalEliminar}
        confirm={eliminarPasajero}
      />
    </View>
  );
}