import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function DoubleButton(props: { name1: string, name2: string, secondary1?: boolean, secondary2?: boolean, action1: (t: any) => void, action2: (t: any) => void}) {
  return (
    <View style={styles.doublebutton}>
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: props.secondary1 ? '#9c9c9c' : 'darkorange'}}
        onPress={props.action1}>
        <Text style={styles.btnText}>{ props.name1 }</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: props.secondary2 ? '#9c9c9c' : 'darkorange'}}
        onPress={props.action2}>
        <Text style={styles.btnText}>{ props.name2 }</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  doublebutton: {
    width: '80%',
    height: 50,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '49%',
    paddingHorizontal: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});