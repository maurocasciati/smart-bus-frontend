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
import { postEscuela, putEscuela } from '../services/escuela.service';
import { AuthContext } from '../auth/AuthProvider';
import CustomText from '../components/form/CustomText';

export default function EscuelaEdicion({ route, navigation }: EscuelaEdicionProps) {
  const { escuela, dataRecorrido, recorrido } = route.params;
  
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
    }
  });

  const guardarEscuela = async (dataEscuela: EscuelaFormType) => {
    setMensajeError(null);

    try {
      const resp = recorrido
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

        { mensajeError && ErrorText(mensajeError) }
        { modoEdicion
          ? <PrimaryButton name="Guardar Escuela" action={handleSubmit(guardarEscuela)} />
          : <PrimaryButton name="Editar Escuela" action={() => setModoEdicion(true)} />
        }
      </View>
    </View>
  );
}
