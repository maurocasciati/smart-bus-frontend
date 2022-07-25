import React, { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { EscuelaEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import { EscuelaFormType } from '../components/form/FormTypes';
import ErrorText from '../components/ErrorText';
import { deleteEscuela, postEscuela, putEscuela } from '../services/escuela.service';
import { AuthContext } from '../auth/AuthProvider';
import CustomText from '../components/form/CustomText';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function EscuelaEdicion({ route, navigation }: EscuelaEdicionProps) {
  const { escuela, dataRecorrido, recorrido } = route.params;
  
  const [showModalEliminar, setShowModalEliminar] = useState<boolean>(false);
  const [modoEdicion, setModoEdicion] = useState<boolean>(!escuela);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);

  const {control, handleSubmit, formState: {errors}} = useForm<EscuelaFormType>({
    defaultValues: {
      id: escuela?.id,
      nombre: escuela?.nombre || '',
      direccion: escuela?.direccion ? {
        domicilio: escuela?.direccion.domicilio || '',
        coordenadas: escuela?.direccion.coordenadas || null,
      } : null,
      emailUsuario: undefined,
      emailUsuarios: escuela?.usuarios?.map(e => e.email) || [],
    }
  });

  const toggleModalEliminar = () => setShowModalEliminar(!showModalEliminar);

  const eliminarEscuela = async () => {
    toggleModalEliminar();

    try {
      const resp = !!escuela && await deleteEscuela(token, escuela.id);
      if(resp){
        Alert.alert(
          '', `La escuela ${escuela?.nombre} fue eliminada con éxito`,
          [{ 
            text: 'OK',
            onPress: () => recorrido ? navigation.navigate('RecorridoDetalle', { recorrido: { ...recorrido, escuela: null }})
              : navigation.navigate('RecorridoListado')
          }]
        );
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  const guardarEscuela = async (dataEscuela: EscuelaFormType) => {
    setMensajeError(null);
    dataEscuela.emailUsuarios.push(dataEscuela.emailUsuario);

    try {
      const resp = escuela
        ? await putEscuela(token, dataEscuela)
        : await postEscuela(token, dataEscuela);
      if(resp){
        Alert.alert('', `La escuela ${dataEscuela.nombre} fue guardada con éxito`);
        dataRecorrido ? navigation.navigate('EscuelaSeleccion', { dataRecorrido, recorrido })
          : recorrido ? navigation.navigate('RecorridoDetalle', { recorrido: { ...recorrido, escuela: resp }})
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
        { escuela && <CustomText value={escuela.direccion.domicilio}/> }
        { modoEdicion &&
          <CustomGoogleAutocomplete
            control={control}
            name='direccion'
            errors={errors}
            placeholder={escuela ? 'Editar domicilio' : 'Domicilio'}
            rules={VALIDACIONES.TEXTO_NO_VACIO}
          />
        }
        <CustomTextInput
          control={control}
          name='emailUsuario'
          errors={errors}
          placeholder='Email del usuario'
          rules={VALIDACIONES.EMAIL}
          editable={modoEdicion}
        />

        
        { modoEdicion && escuela && <PrimaryButton name="Eliminar Escuela" action={toggleModalEliminar} secondary={true} /> }
        { mensajeError && ErrorText(mensajeError) }
        { modoEdicion && <PrimaryButton name="Guardar Escuela" action={handleSubmit(guardarEscuela)} /> }
        { !modoEdicion && <PrimaryButton name="Editar Escuela" action={() => setModoEdicion(true)} /> }
        
      </View>

      <ModalConfirmacion
        visible={!!escuela && showModalEliminar}
        text={`¿Está seguro de eliminar la escuela ${escuela?.nombre}?`}
        cancel={toggleModalEliminar}
        confirm={eliminarEscuela}
      />
    </View>
  );
}
