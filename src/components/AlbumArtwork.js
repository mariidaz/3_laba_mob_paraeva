import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function AlbumArtwork({ album, size = 112, style }) {
  const title = album?.title || 'Side A';
  return (
    <View style={[styles.frame, { width: size, height: size }, style]}>
      {album?.artwork ? (
        <Image source={{ uri: album.artwork }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.fallback}>
          <View style={styles.recordOuter}><View style={styles.recordInner}><View style={styles.recordDot} /></View></View>
          <Text style={styles.fallbackTitle} numberOfLines={2}>{title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', borderRadius: 4, backgroundColor: COLORS.paperDark },
  image: { width: '100%', height: '100%' },
  fallback: { flex: 1, backgroundColor: COLORS.ink, alignItems: 'center', justifyContent: 'center', padding: 8 },
  recordOuter: { width: '62%', aspectRatio: 1, borderRadius: 100, borderWidth: 1, borderColor: '#333333', alignItems: 'center', justifyContent: 'center' },
  recordInner: { width: '68%', aspectRatio: 1, borderRadius: 100, borderWidth: 1, borderColor: '#222222', alignItems: 'center', justifyContent: 'center' },
  recordDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: COLORS.accent },
  fallbackTitle: { color: COLORS.paper, fontFamily: FONTS.serif, fontSize: 10, textAlign: 'center', marginTop: 7 },
});
