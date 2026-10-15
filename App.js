import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold,
  Manrope_700Bold, Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import {
  PlayfairDisplay_400Regular, PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import { store } from './src/store';
import { restoreLibrary } from './src/store/librarySlice';
import { COLORS, FONTS } from './src/theme';
import RootNavigator from './src/navigation/RootNavigator';

function Bootstrap({ children }) {
  const dispatch = useDispatch();
  const library = useSelector((state) => state.library);
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem('side-a-library-v1')
      .then((value) => {
        if (!active) return;
        if (value) dispatch(restoreLibrary(JSON.parse(value)));
      })
      .catch(() => {})
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem('side-a-library-v1', JSON.stringify({
      savedAlbums: library.savedAlbums, notes: library.notes,
    })).catch(() => {});
  }, [library.savedAlbums, library.notes, ready]);

  if (!ready) return <View style={styles.loading}><ActivityIndicator color={COLORS.accent} /></View>;
  return children;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    [FONTS.body]: Manrope_400Regular,
    [FONTS.medium]: Manrope_500Medium,
    [FONTS.semibold]: Manrope_600SemiBold,
    [FONTS.bold]: Manrope_700Bold,
    [FONTS.extraBold]: Manrope_800ExtraBold,
    [FONTS.serif]: PlayfairDisplay_400Regular,
    [FONTS.serifMedium]: PlayfairDisplay_500Medium,
    [FONTS.serifSemibold]: PlayfairDisplay_600SemiBold,
    [FONTS.serifBold]: PlayfairDisplay_700Bold,
    [FONTS.serifItalic]: PlayfairDisplay_400Regular_Italic,
    [FONTS.mono]: DMMono_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.accent} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Bootstrap>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </Bootstrap>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.paper },
});
