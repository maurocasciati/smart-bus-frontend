import React, { useState } from 'react';
import { useContext } from 'react';
import { View, TextInput, GestureResponderEvent } from 'react-native';
import { AuthContext } from '../../auth/AuthProvider';
import { signIn } from '../../services/login.service';
import { styles } from '../../styles/styles';
import ErrorText from '../ErrorText';
import PrimaryButton from '../PrimaryButton';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const { saveToken, saveRol, saveId } = useContext(AuthContext);

  const onLogin = async (e: GestureResponderEvent) => {
    e.preventDefault();

    setLoginError(null);
    
    try {
      const resp = await signIn(email, password);
      resp?.data.token ? saveToken(resp.data.token) : setLoginError('Usuario no autorizado');
      resp?.data.idTipoDeUsuario ? saveRol(resp.data.idTipoDeUsuario) : setLoginError('Tipo de usuario inválido');
      resp?.data.id ? saveId(resp.data.id) : setLoginError('Usuario no registrado');
    } catch(error) {
      setLoginError(error as string);
    }
  };

  return (
    <>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder='Email'
          onChangeText={setEmail}
        />
      </View>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder='Contraseña'
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>

      {loginError && ErrorText(loginError)}
      <PrimaryButton name={'INGRESAR'} action={onLogin}/>
    </>
  );
}
