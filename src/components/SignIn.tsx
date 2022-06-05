import React, { useState } from 'react';
import { useContext } from 'react';
import { View, TextInput, GestureResponderEvent } from 'react-native';
import { AuthContext, AuthContextType } from '../auth/AuthProvider';
import { styles } from '../styles/styles';
import PrimaryButton from './PrimaryButton';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { token, saveToken } = useContext(AuthContext) as AuthContextType;

  const onLogin = (e: GestureResponderEvent) => {
    e.preventDefault(); 
    console.log({token});
    console.log({email});
    console.log({password});
    saveToken('token');
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
    
      <PrimaryButton name={'INGRESAR'} action={onLogin}/>
    </>
  );
}