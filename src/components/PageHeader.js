import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../theme';

export default function PageHeader({ title = 'SIDE A', action }) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="arrow-back" size={19} color={COLORS.ink} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {action || <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { width: 38, height: 38, borderRadius: 22, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  title: { color: COLORS.ink, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.3 },
  placeholder: { width: 38, height: 38 },
});
