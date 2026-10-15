import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import DiscoverScreen from '../screens/DiscoverScreen';
import JournalScreen from '../screens/JournalScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: { fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.1, marginBottom: 5 },
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 8,
          backgroundColor: COLORS.paper,
          borderTopColor: COLORS.line,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 0,
        },
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            DiscoverTab: focused ? 'compass' : 'compass-outline',
            JournalTab: focused ? 'library' : 'library-outline',
            AboutTab: focused ? 'information-circle' : 'information-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={21} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DiscoverTab" component={DiscoverScreen} options={{ title: 'ВІДКРИВАТИ' }} />
      <Tab.Screen name="JournalTab" component={JournalScreen} options={{ title: 'ЩОДЕННИК' }} />
      <Tab.Screen name="AboutTab" component={AboutScreen} options={{ title: 'ПРО ПРОЄКТ' }} />
    </Tab.Navigator>
  );
}
