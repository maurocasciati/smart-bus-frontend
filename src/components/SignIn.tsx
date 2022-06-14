import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import { View, TextInput, Text, GestureResponderEvent } from 'react-native';
import { AuthContext, AuthContextType } from '../auth/AuthProvider';
import { styles } from '../styles/styles';
import PrimaryButton from './PrimaryButton';
import {REACT_APP_BASE_URL} from '@env';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { saveToken } = useContext(AuthContext);
  const baseUrl = REACT_APP_BASE_URL;
  const [loginError, setLoginError] = useState('');

  const onLogin = async (e: GestureResponderEvent) => {
    e.preventDefault();

    setLoginError('');
    
    try{
      const resp = await axios.post<{token : string}>(`${baseUrl}/Usuario/autenticar`, {email, password});
      
      if(resp.data && resp.data.token){
        saveToken(resp.data.token);
      }
    }
    catch(error){
      if(axios.isAxiosError(error)){
        const err = error as AxiosError;
        const errorResponse = err.response as AxiosResponse<{message?: string, title: string}>;
        if(errorResponse.data)
          setLoginError(errorResponse.data.message ?? errorResponse.data.title);
        else
          setLoginError(err.message);
      }
      else{
        setLoginError(error as string);
      }
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

      {loginError ? ErrorText(loginError) : null}
    
      <PrimaryButton name={'INGRESAR'} action={onLogin}/>
    </>
  );
}

function ErrorText(mensajeError : string){
  return (
    <View>
      <Text>
        {`Error: ${mensajeError}`}
      </Text>
    </View>
  );
}