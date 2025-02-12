import FontAwesome from "@expo/vector-icons/FontAwesome";
// import {
// 	DarkTheme,
// 	DefaultTheme,
// 	ThemeProvider,
// } from "@react-navigation/native";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { Stack, useSegments, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import * as SecureStore from "expo-secure-store";

const tokenCache = {
	async getToken(key: string) {
		try {
			return SecureStore.getItemAsync(key);
		} catch (e) {
			return null;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (e) {
			return;
		}
	},
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
	const segments = useSegments();
	const { isLoaded, isSignedIn } = useAuth();

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

	if (!loaded || !isLoaded) {
		return <View />;
	}

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
};

const RootLayoutNav = () => {
	return (
		<ClerkProvider
			publishableKey={CLERK_PUBLISHABLE_KEY!}
			tokenCache={tokenCache}>
			{/* <ClerkLoaded> */}
			<InitialLayout />
		</ClerkProvider>
	);
};

export default RootLayoutNav;
