import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="LanguageScreen" options={{ title: 'Select Language'}} />
      <Stack.Screen name="StagingScreen" options={{ title: ''}} />
    </Stack>    
  );
}
