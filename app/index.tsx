import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import welcomeImage from "@/assets/images/welcome.png";
import { Link, router } from "expo-router";
import Colors from "@/constants/Colors";
const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const index = () => {
	return (
		<View style={styles.container}>
			<Image style={styles.welcome} source={{ uri: welcome_image }} />
			<Text style={styles.headline}>Welcome to WhatsApp Clone</Text>
			<Text style={styles.description}>
				Read our <Text style={styles.links}>Privacy Policy</Text>. Tap "Agree &
				Continue" to accept the{" "}
				<Text style={styles.links}>Terms of Service</Text>.
			</Text>
			<TouchableOpacity
				onPress={() => router.replace("/otp")}
				style={styles.button}>
				<Text style={styles.buttonText}>Agree & Continue</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	welcome: {
		width: "100%",
		height: 300,
		marginBottom: 40,
	},
	headline: {
		fontSize: 24,
		fontWeight: "bold",
		marginVertical: 20,
	},
	description: {
		textAlign: "center",
		fontSize: 14,
		color: Colors.gray,
		marginBottom: 20,
	},
	links: {
		color: Colors.primary,
	},
	button: {
		width: "100%",
		alignItems: "center",
	},
	buttonText: {
		fontSize: 22,
		color: Colors.primary,
		fontWeight: "bold",
	},
});

export default index;
