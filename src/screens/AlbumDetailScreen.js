import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Screen from '../components/Screen';
import PageHeader from '../components/PageHeader';
import AlbumArtwork from '../components/AlbumArtwork';
import { toggleSavedAlbum } from '../store/librarySlice';
import { COLORS, FONTS } from '../theme';
import { readAlbumParam } from '../navigation/albums';

export default function AlbumDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const albumFromUrl = readAlbumParam(params.album);
  const dispatch = useDispatch();
  const { discover, library } = useSelector((state) => state);
  const { savedAlbums, notes } = library;
  const album = albumFromUrl || discover.albums.find((item) => item.id === String(params.id)) || savedAlbums.find((item) => item.id === String(params.id));
  const saved = album ? savedAlbums.some((item) => item.id === album.id) : false;
  const note = album ? notes[album.id] : null;

  if (!album) {
    return (
      <Screen>
        <PageHeader title="КАРТКА АЛЬБОМУ" />
        <Text style={styles.missing}>Не вдалося відкрити альбом. Повернись до пошуку й обери його ще раз.</Text>
      </Screen>
    );
  }
  const year = album.releaseDate ? new Date(album.releaseDate).getFullYear() : '—';

  const openStore = async () => {
    if (!album.storeUrl) return;
    try { await Linking.openURL(album.storeUrl); } catch (_) {}
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <PageHeader
        title="КАРТКА АЛЬБОМУ"
        action={
          <Pressable
            onPress={() => dispatch(toggleSavedAlbum(album))}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Прибрати зі збережених' : 'Зберегти альбом'}
            style={[styles.headerAction, saved && styles.headerActionSaved]}
          >
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? COLORS.paper : COLORS.ink} />
          </Pressable>
        }
      />

      <View style={styles.coverStage}>
        <AlbumArtwork album={album} size={220} style={styles.cover} />
      </View>

      <View style={styles.metaLine}>
        <Text style={styles.genre}>{album.genre || 'МУЗИКА'}</Text>
        <Text style={styles.year}>{year}  ·  {album.trackCount ? `${album.trackCount} ТРЕКІВ` : 'АЛЬБОМ'}</Text>
      </View>
      <Text style={styles.title}>{album.title}</Text>
      <Pressable onPress={() => navigation.navigate('Artist', { name: album.artist })} style={styles.artistLink}>
        <Text style={styles.artist}>{album.artist}</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.accent} />
      </Pressable>

      <View style={styles.rule} />
      <Text style={styles.sectionLabel}>ТВОЄ ВРАЖЕННЯ</Text>
      {note ? (
        <Pressable onPress={() => navigation.navigate('NoteEditor', { id: album.id, album })} style={styles.notePreview}>
          <View style={styles.noteTop}>
            <Text style={styles.noteMood}>{note.mood || 'НОТАТКА'}</Text>
            <Text style={styles.noteStars}>{'★'.repeat(note.rating || 0)}</Text>
          </View>
          <Text numberOfLines={3} style={styles.noteText}>{note.text}</Text>
          <Text style={styles.editNote}>РЕДАГУВАТИ НОТАТКУ  ↗</Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => navigation.navigate('NoteEditor', { id: album.id, album })} style={styles.writeNote}>
          <View style={styles.writeIcon}>
            <Ionicons name="create-outline" size={18} color={COLORS.accent} />
          </View>
          <View style={styles.writeCopy}>
            <Text style={styles.writeTitle}>Запиши, як він звучить для тебе.</Text>
            <Text style={styles.writeSub}>Оцінка, настрій і кілька слів.</Text>
          </View>
          <Ionicons name="arrow-forward" size={17} color={COLORS.accent} />
        </Pressable>
      )}

      <Pressable onPress={openStore} disabled={!album.storeUrl} style={[styles.storeButton, !album.storeUrl && styles.disabled]}>
        <Ionicons name="open-outline" size={17} color={COLORS.paper} />
        <Text style={styles.storeText}>ВІДКРИТИ В APPLE MUSIC</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.paper} />
      </Pressable>
      <Text style={styles.storeCaption}>Обкладинка та дані надані Apple Music.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 10, paddingBottom: 30 },
  headerAction: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.paper },
  headerActionSaved: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  coverStage: { alignItems: 'center', justifyContent: 'center', minHeight: 250, marginBottom: 18, backgroundColor: COLORS.paperDark, borderRadius: 8, padding: 16 },
  cover: { width: 220, height: 220, borderRadius: 6, shadowColor: COLORS.shadow, shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  metaLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  genre: { color: COLORS.accent, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1 },
  year: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.3 },
  title: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 32, lineHeight: 39, marginTop: 8 },
  artistLink: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 4 },
  artist: { color: COLORS.ink, fontFamily: FONTS.medium, fontSize: 15 },
  rule: { height: 1, backgroundColor: COLORS.line, marginVertical: 20 },
  sectionLabel: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.1, marginBottom: 12 },
  writeNote: { minHeight: 74, backgroundColor: COLORS.paperDark, borderRadius: 8, borderWidth: 1, borderColor: COLORS.line, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 14 },
  writeIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.accentMuted, alignItems: 'center', justifyContent: 'center' },
  writeCopy: { flex: 1, gap: 3 },
  writeTitle: { color: COLORS.ink, fontFamily: FONTS.semibold, fontSize: 13 },
  writeSub: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 11 },
  notePreview: { backgroundColor: COLORS.paperDark, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: COLORS.line },
  noteTop: { flexDirection: 'row', justifyContent: 'space-between' },
  noteMood: { color: COLORS.accent, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 1 },
  noteStars: { color: COLORS.accent, fontSize: 12, letterSpacing: 1 },
  noteText: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 16, lineHeight: 23, marginTop: 10 },
  editNote: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.8, marginTop: 14 },
  storeButton: { minHeight: 52, backgroundColor: COLORS.ink, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 22 },
  storeText: { color: COLORS.paper, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1 },
  disabled: { opacity: 0.5 },
  storeCaption: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 9, textAlign: 'center', marginTop: 9 },
  missing: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 13, lineHeight: 20, marginTop: 24 },
});
