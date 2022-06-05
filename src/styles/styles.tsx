import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  map: {
    height: '60%',
    width: '90%',
  },
  container: {
    flex: 1,
    // alignItems: 'centser',
    justifyContent: 'center',
    backgroundColor: 'peachpuff',
  },
  center: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'peachpuff',
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
  primaryBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: 'darkorange',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  secondaryText: {
    color: '#000',
    padding: 14,
  }
});