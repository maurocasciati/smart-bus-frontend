import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'peachpuff',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  center: {
    alignItems: 'center',
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
  },
  textInput: {
    color: 'black',
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  secondaryText: {
    color: '#000',
    padding: 14,
  }
});