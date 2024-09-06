import React, { useEffect } from "react";
import { router, Slot, Stack } from "expo-router";
import auth from "@react-native-firebase/auth";
import { StatusBar } from "expo-status-bar";
function Layout() {
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
    // else {
    //   auth().signOut();
    // }
  }, [user]);

  return (
    <>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="todo/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar translucent={true} backgroundColor="#fff" />
    </>
  );
}

export default Layout;
