import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    dancingScript: require('../assets/fonts/DancingScript-VariableFont_wght.ttf'),
    montserat: require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
  });

  if (!loaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  // ✅ Only allow logged-in + verified users into the app
  const isVerified = user && user.emailVerified;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isVerified ? <AppStack /> : <AuthStack />}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// Stack for logged-in users
function AppStack() {
  console.log("________________Rendering AppStack");
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="categories/[category]" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="recipeDetail" options={{ headerShown: false }} />
      <Stack.Screen name="savedAIRecipes" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}

// Stack for authentication (login/signup)
function AuthStack() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}