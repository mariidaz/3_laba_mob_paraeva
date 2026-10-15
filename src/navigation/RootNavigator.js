import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AlbumDetailScreen from '../screens/AlbumDetailScreen';
import ArtistScreen from '../screens/ArtistScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: COLORS.paper },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ animation: 'none' }} />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} />
      <Stack.Screen name="Artist" component={ArtistScreen} />
      <Stack.Screen
        name="NoteEditor"
        component={NoteEditorScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
