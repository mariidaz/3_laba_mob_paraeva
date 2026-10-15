import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Screen from '../components/Screen';
import PageHeader from '../components/PageHeader';
import AlbumRow from '../components/AlbumRow';
import { searchAlbums } from '../services/itunes';
import { COLORS, FONTS } from '../theme';

export default function ArtistScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const artistName = Array.isArray(params.name) ? params.name[0] : params.name || 'Виконавець';
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => searchAlbums(artistName, { limit: 25 }))
      .then((results) => {
        if (!active) return;
        const related = results.filter((item) => item.artist.toLowerCase().includes(artistName.toLowerCase()) || artistName.toLowerCase().includes(item.artist.toLowerCase()));
        setAlbums(related.length ? related : results);
        setError('');
      })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [artistName]);

  return (
    <Screen scroll contentStyle={styles.content}>
      <PageHeader title="ВИКОНАВЕЦЬ" />
      <View style={styles.hero}>
        <Text style={styles.kicker}>ВИКОНАВЕЦЬ · КАТАЛОГ</Text>
        <Text style={styles.name}>{artistName}</Text>
        <Text style={styles.description}>Відкривай альбоми, слухай уважно й залишай власні нотатки.</Text>
      </View>

      <View style={styles.sectionHead}>
        <View>
          <Text style={styles.sectionKicker}>РЕФЕРЕНСИ</Text>
          <Text style={styles.sectionTitle}>Альбоми виконавця</Text>
        </View>
        <Ionicons name="musical-notes-outline" size={20} color={COLORS.accent} />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.accent} />
          <Text style={styles.loadingText}>Шукаємо в каталозі…</Text>
        </View>
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : albums.length ? (
        albums.map((item) => (
          <AlbumRow key={item.id} album={item} onPress={() => navigation.navigate('AlbumDetail', { album: item })} />
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Ще не знайшли релізів.</Text>
          <Text style={styles.message}>Спробуй пошукати виконавця через вкладку «Відкривати».</Text>
          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'DiscoverTab' })}>
            <Text style={styles.link}>ВІДКРИТИ ПОШУК  ↗</Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 10 },
  hero: { backgroundColor: COLORS.ink, borderRadius: 8, minHeight: 180, padding: 22, justifyContent: 'center' },
  kicker: { color: COLORS.accent, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.1, marginBottom: 8 },
  name: { color: COLORS.paper, fontFamily: FONTS.serif, fontSize: 32, lineHeight: 39 },
  description: { color: '#B3B3B3', fontFamily: FONTS.body, fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 280 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 28, marginBottom: 8 },
  sectionKicker: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 1 },
  sectionTitle: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 21, marginTop: 3 },
  loading: { minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 9 },
  loadingText: { color: COLORS.muted, fontFamily: FONTS.serifItalic, fontSize: 15 },
  message: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 12, lineHeight: 19, marginTop: 8 },
  empty: { paddingVertical: 18 },
  emptyTitle: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 20 },
  link: { color: COLORS.accent, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 0.8, marginTop: 15 },
});
