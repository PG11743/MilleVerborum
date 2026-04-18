import { Stack } from "expo-router";
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { openLanguageDatabase } from "@/db/openDatabase"; 

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
        try {
            console.log('Initializing Database...');
            
            // 2. Call your DB build function here
            // This is where those 14,000 inserts happen
            await openLanguageDatabase(); 
            
        } catch (e) {
            console.warn(e);
        } finally {
            // 3. Tell the app we are ready
            setAppIsReady(true);
        }
        }

        prepare();
  }, []);

  // 4. This function is called once the root view has performed layout
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // 5. Hide the splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Keep showing the splash screen
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
    </View>
  );
}
