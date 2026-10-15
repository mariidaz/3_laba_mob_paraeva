import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlbumArtwork from './AlbumArtwork';
import { COLORS, FONTS } from '../theme';

export function getYear(date) {
  return date ? new Date(date).getFullYear() : '';
}

export default function AlbumRow({ album, onPress, trailing, compact = false }) {
  return (
    <View style={[styles.row, compact && styles.compact]}>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.main}>
        <AlbumArtwork album={album} size={compact ? 52 : 62} />
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>{album.title}</Text>
          <Text numberOfLines={1} style={styles.artist}>{album.artist}</Text>
          <Text numberOfLines={1} style={styles.meta}>{getYear(album.releaseDate)}{album.genre ? `  ·  ${album.genre}` : ''}</Text>
        </View>
      </Pressable>
      {trailing || <Ionicons name="chevron-forward" size={17} color={COLORS.muted} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 82, flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.line },
  compact: { minHeight: 70 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 13 },
  copy: { flex: 1, gap: 3 },
  title: { color: COLORS.ink, fontFamily: FONTS.semibold, fontSize: 13 },
  artist: { color: COLORS.ink, fontFamily: FONTS.body, fontSize: 12 },
  meta: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 0.25 },
});
