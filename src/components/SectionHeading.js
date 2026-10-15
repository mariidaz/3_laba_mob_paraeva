import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 },
  copy: { gap: 3 },
  eyebrow: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 23, lineHeight: 29 },
});
