import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from '../styles/styles';
import PrimaryButton from './PrimaryButton';

export default function SignUp() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    console.log({nombre});
    console.log({apellido});
    console.log({email});
    console.log({password});
  };

  return (
    <>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder='Nombre'
          onChangeText={setNombre}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder='Apellido'
          onChangeText={setApellido}
        />
      </View>
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
    
      <PrimaryButton name='REGISTRARSE' action={onLogin} />
    </>
  );
}