import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/login");
        return;
      }

      const rememberStr = await AsyncStorage.getItem("rememberMeData");
      if (rememberStr) {
        const { timestamp, remember } = JSON.parse(rememberStr);
        if (remember) {
          const DIAS_15 = 15 * 24 * 60 * 60 * 1000;
          if (Date.now() - timestamp > DIAS_15) {
            // Exceeded 15 days, force logout
            await supabase.auth.signOut();
            router.replace("/login");
          } else {
            // Within 15 days, automatically enter the app
            router.replace("/(tabs)");
          }
        } else {
          // If remember is false, we don't persist between app restarts normally,
          // but if they just closed and opened the app, log them out.
          await supabase.auth.signOut();
          router.replace("/login");
        }
      } else {
        await supabase.auth.signOut();
        router.replace("/login");
      }
    };

    setTimeout(() => {
      checkSession();
    }, 100);
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
