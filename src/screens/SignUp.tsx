import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

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
      <Image style={styles.image} source={require('../../assets/favicon.png')}/>
      
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
    
      <TouchableOpacity style={styles.primaryBtn} onPress={onLogin}>
        <Text style={styles.primaryBtnText}>REGISTRARSE</Text>
      </TouchableOpacity>
    </>
  );
}