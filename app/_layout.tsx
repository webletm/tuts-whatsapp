import FontAwesome from "@expo/vector-icons/FontAwesome";
// import {
// 	DarkTheme,
// 	DefaultTheme,
// 	ThemeProvider,
// } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: "#fff" },
				}}
			/>
			<Stack.Screen
				name="otp"
				options={{
					headerShown: true,
					headerTitle: "Enter Your Phone Number",
					headerBackVisible: false,
					contentStyle: { backgroundColor: "#EFEEF6" },
				}}
			/>
			<Stack.Screen
				name="verify/[phone]"
				options={{
					headerShown: true,
					headerTitle: "Verify Your Phone Number",
					//headerBackVisible: false,
					headerBackTitle: "Edit Number",
					contentStyle: { backgroundColor: "#EFEEF6" },
				}}
			/>
			{/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
		</Stack>
	);
}
