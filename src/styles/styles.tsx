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
    marginBottom: 14,
  },
  list: {
    flex: 1,
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 6,
  },
  inputView: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    elevation: 4,
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
  },
  line: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    alignContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    alignContent: 'center',
  },
  type: {
    fontSize: 12,
    textAlign: 'center',
  },
  hour: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: -30,
  },
  footer: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 20,
  },
  detallesRecorrido: {
    padding: 20,
    paddingBottom: 5,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  detallesRecorridoIrregularidades: {
    padding: 20,
    paddingBottom: 5,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  itemsmall: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});