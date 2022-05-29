import React from "react";
import { View, Text, Button } from "react-native";
import { styles } from "../styles/styles";

export default function HomeScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>Open up App.tsx to start working on your app!</Text>
			<Button
        title="Ver detalle recorrido"
        onPress={() => navigation.navigate('Detalle Recorrido')}
    	/>
		</View>
	);
}
