import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbums } from '../store/discoverSlice';
import { toggleSavedAlbum } from '../store/librarySlice';
import { COLORS, FONTS } from '../theme';
import Screen from '../components/Screen';
import AlbumArtwork from '../components/AlbumArtwork';
import SectionHeading from '../components/SectionHeading';
import PressableScale from '../components/PressableScale';

const FILTERS = ['українське', 'інді', 'shoegaze', 'dream pop', 'альтернатива'];

function AlbumCard({ album, saved, onOpen, onSave }) {
  return (
    <PressableScale onPress={onOpen} style={styles.cardWrap}>
      <View style={styles.cardArtworkWrap}>
        <AlbumArtwork album={album} size={148} style={styles.cardArtwork} />
        <Pressable onPress={onSave} accessibilityRole="button" accessibilityLabel={saved ? 'Прибрати зі збережених' : 'Зберегти альбом'} style={styles.saveDot}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={15} color={saved ? COLORS.accent : COLORS.ink} />
        </Pressable>
      </View>
      <Text numberOfLines={1} style={styles.cardTitle}>{album.title}</Text>
      <Text numberOfLines={1} style={styles.cardArtist}>{album.artist}</Text>
      <Text style={styles.cardYear}>{album.releaseDate ? new Date(album.releaseDate).getFullYear() : album.genre}</Text>
    </PressableScale>
  );
}

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { albums, status, error, term } = useSelector((state) => state.discover);
  const savedAlbums = useSelector((state) => state.library.savedAlbums);
  const [query, setQuery] = useState('');
  const savedIds = useMemo(() => new Set(savedAlbums.map((album) => album.id)), [savedAlbums]);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchAlbums({ term: 'ukrainian indie', limit: 30 }));
  }, [dispatch, status]);

  const search = (value) => {
    const clean = value.trim();
    if (clean) {
      setQuery(clean);
      dispatch(fetchAlbums({ term: clean, limit: 30 }));
    }
  };

  const openAlbum = (album) => navigation.navigate('AlbumDetail', { album });

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.topline}>
        <View style={styles.brandMark}><Ionicons name="musical-notes" size={14} color={COLORS.accent} /></View>
        <Text style={styles.brand}>SIDE A <Text style={styles.brandSlash}>/</Text> СТОРОНА А</Text>
      </View>

      <View style={styles.intro}>
        <Text style={styles.kicker}>СЛУХАЙ УВАЖНО · ЗБЕРІГАЙ СВОЄ</Text>
        <Text style={styles.headline}>Знайди свій{ '\n' }<Text style={styles.headlineItalic}>наступний альбом.</Text></Text>
        <Text style={styles.introCopy}>Музика для вечорів, що залишаються з тобою.</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.ink} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => search(query)}
          returnKeyType="search"
          placeholder="Альбом, виконавець або настрій"
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
          accessibilityLabel="Пошук альбомів"
        />
        {!!query && <Pressable onPress={() => { setQuery(''); dispatch(fetchAlbums({ term: 'ukrainian indie', limit: 30 })); }}><Ionicons name="close-circle" size={18} color={COLORS.muted} /></Pressable>}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((filter) => (
          <Pressable key={filter} onPress={() => search(filter)} style={[styles.filter, term.toLowerCase() === filter && styles.filterActive]}>
            <Text style={[styles.filterText, term.toLowerCase() === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {status === 'loading' && albums.length === 0 ? (
        <View style={styles.loading}><ActivityIndicator color={COLORS.ink} /><Text style={styles.loadingText}>Збираємо платівки…</Text></View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline-outline" size={22} color={COLORS.rust} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => dispatch(fetchAlbums({ term: query || 'indie pop', limit: 30 }))}><Text style={styles.retry}>СПРОБУВАТИ ЩЕ</Text></Pressable>
        </View>
      ) : (
        <>
          <SectionHeading
            eyebrow={status === 'loading' ? 'ОНОВЛЮЄМО КАТАЛОГ' : `${albums.length} АЛЬБОМІВ · APPLE MUSIC`}
            title={term ? `Результати: ${term}` : 'Зараз у програвачі'}
            action={status === 'loading' ? <ActivityIndicator color={COLORS.ink} size="small" /> : null}
          />
          {albums.length === 0 && status === 'succeeded' ? (
            <View style={styles.emptySearch}><Text style={styles.emptyTitle}>Тут поки тиша.</Text><Text style={styles.emptyCopy}>Спробуй інше ім’я або жанр.</Text></View>
          ) : (
            <View style={styles.gridContent}>
              {Array.from({ length: Math.ceil(albums.length / 2) }, (_, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.cardGrid}>
                  {albums.slice(rowIndex * 2, rowIndex * 2 + 2).map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      saved={savedIds.has(album.id)}
                      onOpen={() => openAlbum(album)}
                      onSave={() => dispatch(toggleSavedAlbum(album))}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <View style={styles.bottomNote}>
        <View style={styles.noteLine} />
        <Text style={styles.bottomNoteText}>КАТАЛОГИ — ЦЕ ПОЧАТОК. ІСТОРІЇ — ТВОЇ.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 10, paddingBottom: 24 },
  topline: { height: 40, flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.ink, alignItems: 'center', justifyContent: 'center' },
  brand: { flex: 1, color: COLORS.ink, fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 1.2 },
  brandSlash: { color: COLORS.accent, fontFamily: FONTS.serif },
  intro: { marginTop: 30, marginBottom: 22 },
  kicker: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.1 },
  headline: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 37, lineHeight: 43, marginTop: 10 },
  headlineItalic: { color: COLORS.accent, fontFamily: FONTS.serifItalic },
  introCopy: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 12, marginTop: 10 },
  searchBox: { height: 52, borderRadius: 5, backgroundColor: COLORS.paperDark, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14 },
  searchInput: { flex: 1, color: COLORS.ink, fontFamily: FONTS.medium, fontSize: 12, paddingVertical: 0 },
  filters: { gap: 8, paddingVertical: 15, paddingRight: 16 },
  filter: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.paper },
  filterActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accent },
  filterText: { color: COLORS.ink, fontFamily: FONTS.medium, fontSize: 11 },
  filterTextActive: { color: COLORS.paper },
  cardGrid: { justifyContent: 'space-between', gap: 14 },
  gridContent: { gap: 18 },
  cardWrap: { width: '47%', marginBottom: 2 },
  cardArtworkWrap: { position: 'relative', marginBottom: 10 },
  cardArtwork: { width: '100%', aspectRatio: 1, height: undefined, borderRadius: 5 },
  saveDot: { position: 'absolute', right: 8, top: 8, width: 30, height: 30, borderRadius: 16, backgroundColor: COLORS.paper, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: COLORS.ink, fontFamily: FONTS.semibold, fontSize: 12 },
  cardArtist: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 11, marginTop: 2 },
  cardYear: { color: COLORS.rust, fontFamily: FONTS.mono, fontSize: 9, marginTop: 4, textTransform: 'uppercase' },
  loading: { minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: COLORS.muted, fontFamily: FONTS.serifItalic, fontSize: 16 },
  errorBox: { minHeight: 160, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 28 },
  errorText: { color: COLORS.ink, fontFamily: FONTS.body, textAlign: 'center', fontSize: 13 },
  retry: { color: COLORS.rust, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1 },
  emptySearch: { paddingVertical: 36, alignItems: 'center' },
  emptyTitle: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 21 },
  emptyCopy: { color: COLORS.muted, fontFamily: FONTS.body, marginTop: 6, fontSize: 12 },
  bottomNote: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 28 },
  noteLine: { width: 25, height: 1, backgroundColor: COLORS.rust },
  bottomNoteText: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.7 },
});
