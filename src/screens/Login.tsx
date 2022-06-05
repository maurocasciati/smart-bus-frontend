import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Login() {
  const [toggleScreen, setToggleScreen] = useState(true);

  const handleToggle = () => {
    setToggleScreen(!toggleScreen);
  }

  return (
    <View style={styles.container}>
      { toggleScreen ? <SignIn/> : <SignUp/>}

      <View>
        { toggleScreen
          ? <TouchableOpacity onPress={handleToggle}>
              <Text style={styles.secondaryText}>¿No tenés cuenta? Registrate</Text>
            </TouchableOpacity>
          : <TouchableOpacity onPress={handleToggle}>
              <Text style={styles.secondaryText}>¿Ya estás registrado? Iniciá sesión</Text>
            </TouchableOpacity>}
      </View>
    </View>
  );
}