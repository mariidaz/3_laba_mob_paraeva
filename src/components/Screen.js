import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme';

export default function Screen({ children, scroll = false, contentStyle, edges = ['top'] }) {
  const content = scroll
    ? <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, contentStyle]}>{children}</ScrollView>
    : <View style={[styles.content, contentStyle]}>{children}</View>;
  return <SafeAreaView edges={edges} style={styles.safe}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 26 },
});
