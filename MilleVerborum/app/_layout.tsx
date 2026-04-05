import { Stack } from "expo-router";
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
            title: 'Home',
            headerTransparent: true,
            headerTitleStyle: {color: '#ffffff'},
            headerTintColor: '#ffffff',
            }}
        />
        <Stack.Screen name="LanguageScreen" options={{
            title: 'Select Language',
            headerTransparent: true,
            headerTitleStyle: {color: '#ffffff'},
            headerTintColor: '#ffffff',
            headerStyle: {backgroundColor: 'transparent'},
            headerBackground: () => <View style={{ flex: 1, backgroundColor: 'transparent' }}/>}}
        />
        <Stack.Screen name="StagingScreen" options={{
            title: '',
            headerTransparent: true,
            headerTitleStyle: {color: '#ffffff'},
            headerTintColor: '#ffffff',
            headerStyle: {backgroundColor: 'transparent'},
            headerBackground: () => <View style={{ flex: 1, backgroundColor: 'transparent' }}/>}}
        />
        <Stack.Screen name="about" options={{
            title: 'About Mille Verba',
            headerTransparent: true,
            headerTitleStyle: {color: '#ffffff'},
            headerTintColor: '#ffffff',
            }}
        />
        <Stack.Screen name="LanguageSelect" options={{ title: 'Add Language', presentation: 'modal' }} />
        <Stack.Screen name="terms" options={{ title: 'User Agreement', presentation: 'modal' }} />
    </Stack>    
  );
}
