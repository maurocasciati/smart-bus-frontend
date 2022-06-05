import React, { useState } from 'react';
import { useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { AuthContext, AuthContextType } from '../auth/AuthProvider';
import { styles } from '../styles/styles';

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
      <Image style={styles.image} source={require('../../assets/favicon.png')}/>
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
        <Text style={styles.primaryBtnText}>INGRESAR</Text>
      </TouchableOpacity>
    </>
  );
}