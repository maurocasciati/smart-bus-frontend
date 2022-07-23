import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import SignIn from '../components/login/SignIn';
import SignUp from '../components/login/SignUp';
import { styles } from '../styles/styles';

export default function Login() {
  const [toggleScreen, setToggleScreen] = useState(true);

  const handleToggle = () => {
    setToggleScreen(!toggleScreen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image style={styles.image} source={require('../../assets/bus.png')}/>

        { toggleScreen ? <SignIn/> : <SignUp toggleLogin={handleToggle}/> }

        <TouchableOpacity onPress={handleToggle}>
          <Text style={styles.secondaryText}>
            { toggleScreen
              ? '¿No tenés cuenta? Registrate'
              : '¿Ya estás registrado? Iniciá sesión'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}