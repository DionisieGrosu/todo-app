import { Redirect, router, SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { withExpoSnack } from "nativewind";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import ToastProvider from "@/providers/ToastProvider";
import Loader from "@/components/Loader";

SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [loaded, error] = useFonts({
    "Montserrat-Regular": require("./../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("./../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("./../assets/fonts/Montserrat-SemiBold.ttf"),
    "SpaceMono-Regular": require("./../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    console.log("USER DATA");
    console.log(user);
    if (!initializing && user && loaded) {
      router.replace("/(auth)/home");
    }
  }, [user, loaded, initializing]);

  if (initializing || !loaded) return <Loader />;

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="forgotPassword"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
};
// export default withExpoSnack(RootLayout);
export default RootLayout;
