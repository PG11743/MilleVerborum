import { Stack } from "expo-router";
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', headerTransparent: true }} />
        <Stack.Screen name="LanguageScreen" options={{
            title: 'Select Language',
            headerTransparent: true,
            headerTitleStyle: {color: '#000000'},
            headerTintColor: '#000000',
            headerStyle: {backgroundColor: 'transparent'},
            headerBackground: () => <View style={{ flex: 1, backgroundColor: 'transparent' }}/>}}
        />
        <Stack.Screen name="StagingScreen" options={{ title: ''}} />
        <Stack.Screen name="LanguageSelect" options={{ title: 'Add Language', presentation: 'modal' }} />
    </Stack>    
  );
}
