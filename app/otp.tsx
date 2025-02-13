import {
	View,
	Text,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Linking,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MaskInput from "react-native-mask-input";
import { router } from "expo-router";
import {
	isClerkAPIResponseError,
	useSignIn,
	useSignUp,
} from "@clerk/clerk-expo";

const otp = () => {
	const [loading, setLoading] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0;
	const { signUp, setActive } = useSignUp();
	const { signIn } = useSignIn();

	const openLink = () => {
		Linking.openURL("https://www.whatsapp.com/legal/#terms-of-service");
	};

	const sendOtp = async () => {
		setLoading(true);
		try {
			await signUp!.create({
				phoneNumber,
			});
			signUp!.preparePhoneNumberVerification();
			router.push(`/verify/${phoneNumber}`);
		} catch (err) {
			console.log(err);
			if (isClerkAPIResponseError(err)) {
				if (err.errors[0].code === "form_identifier_already_exists") {
					console.log("User already exists");
					await trySignIn();
				} else {
					setLoading(false);
					Alert.alert("Error", err.errors[0].message);
				}
			}
		}
	};
	const trySignIn = async () => {
		const { supportedFirstFactors } = await signIn!.create({
			identifier: phoneNumber,
		});

		const firstPhoneFactor = supportedFirstFactors.find((factor) => {
			return factor.strategy === "phone_code";
		});

		const { phoneNumberId } = firstPhoneFactor;

		await signIn!.prepareFirstFactor({
			strategy: "phone_code",
			phoneNumberId,
		});

		router.push(`/verify/${phoneNumber}?signin=true`);
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAvoidingView style={{ flex: 1 }}>
					<View style={styles.container}>
						{loading && (
							<View style={styles.loading}>
								<ActivityIndicator size={"large"} color={Colors.primary} />
								<Text style={{ fontSize: 18, padding: 10 }}>
									Sending code...
								</Text>
							</View>
						)}
						<Text style={styles.description}>
							Whatsapp will need to verify your account. Carrier charges may
							apply.
						</Text>
						<View style={styles.list}>
							<View style={styles.listItem}>
								<Text style={styles.listItemText}>Germany</Text>
								<Ionicons
									name="chevron-forward"
									size={24}
									color={Colors.gray}
								/>
							</View>
							<View style={styles.separator} />
							<MaskInput
								style={styles.input}
								keyboardType="numeric"
								autoFocus
								placeholder="+61 400 000 000"
								value={phoneNumber}
								onChangeText={(masked, unmasked) => {
									setPhoneNumber("+" + masked); // you can use the unmasked value as well

									// assuming you typed "9" all the way:
									console.log(masked); // (99) 99999-9999
									console.log(unmasked); // 99999999999
								}}
								mask={[
									`+`,
									/\d/,
									/\d/,

									/\d/,
									/\d/,
									/\d/,

									/\d/,
									/\d/,
									/\d/,
									/\d/,
									/\d/,
									/\d/,
								]}
							/>
						</View>
						<Text style={styles.legal}>
							By tapping "Agree and continue", you accept the{" "}
							<Text style={styles.link} onPress={openLink}>
								Terms of Service
							</Text>{" "}
							and{" "}
							<Text style={styles.link} onPress={openLink}>
								Privacy Policy
							</Text>{" "}
							of Whatsapp.
						</Text>

						{/* <View style={{ flex: 1 }} /> */}

						<TouchableOpacity
							style={[
								styles.button,
								phoneNumber !== "" ? styles.enabled : null,
							]}
							onPress={sendOtp}>
							<Text
								style={[
									styles.buttonText,
									phoneNumber !== "" ? styles.enabled : null,
								]}>
								Next
							</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 20,
		backgroundColor: Colors.background,
		gap: 20,
	},
	description: {
		fontSize: 14,
		color: Colors.gray,
	},
	legal: {
		fontSize: 12,
		textAlign: "center",
		color: "#000",
	},
	link: {
		color: Colors.primary,
	},
	button: {
		width: "100%",
		alignItems: "center",
		backgroundColor: Colors.lightGray,
		padding: 10,
		borderRadius: 10,
	},
	enabled: {
		backgroundColor: Colors.primary,
		color: "#fff",
	},
	buttonText: {
		color: Colors.gray,
		fontSize: 22,
		fontWeight: "500",
	},
	list: {
		backgroundColor: "#fff",
		width: "100%",
		borderRadius: 10,
		padding: 10,
	},
	listItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 6,
		marginBottom: 10,
	},
	listItemText: {
		fontSize: 18,
		color: Colors.primary,
	},
	separator: {
		width: "100%",
		height: StyleSheet.hairlineWidth,
		backgroundColor: Colors.gray,
		opacity: 0.3,
	},
	input: {
		backgroundColor: "#fff",
		width: "100%",
		fontSize: 16,
		padding: 6,
		marginTop: 10,
	},

	loading: {
		...StyleSheet.absoluteFillObject,
		zIndex: 10,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default otp;
